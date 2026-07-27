import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/firebaseConfig/init";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const rootUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_URL
    : process.env.NEXT_PUBLIC_DEV_URL;

async function getOrCreateStripeCustomer(
  userId: string,
  email?: string,
): Promise<string> {
  const snapshot = await getDoc(doc(db, "users", userId));
  let stripeCustomerId: string = snapshot.data()?.stripe_customer_id;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({ email });
    stripeCustomerId = customer.id;
    await updateDoc(doc(db, "users", userId), {
      stripe_customer_id: stripeCustomerId,
    });
  }

  return stripeCustomerId;
}

// /**
//  * @swagger
//  * /api/payment-methods:
//  *   get:
//  *     summary: Get the saved card payment method for a user
//  *     tags: [Payments]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: userId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Payment method details or null
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 paymentMethod:
//  *                   type: object
//  *                   nullable: true
//  *                   properties:
//  *                     brand:
//  *                       type: string
//  *                     last4:
//  *                       type: string
//  *                     exp_month:
//  *                       type: integer
//  *                     exp_year:
//  *                       type: integer
//  *       400:
//  *         description: userId is required
//  *       401:
//  *         description: Unauthorized
//  *   post:
//  *     summary: Create a Stripe billing portal session for a user
//  *     tags: [Payments]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [userId]
//  *             properties:
//  *               userId:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Stripe billing portal URL
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 url:
//  *                   type: string
//  *       401:
//  *         description: Unauthorized
//  */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ paymentMethod: null }, { status: 400 });
  }

  const snapshot = await getDoc(doc(db, "users", userId));
  const stripeCustomerId: string | undefined =
    snapshot.data()?.stripe_customer_id;

  if (!stripeCustomerId) {
    return NextResponse.json({ paymentMethod: null });
  }

  const paymentMethods = await stripe.paymentMethods.list({
    customer: stripeCustomerId,
    type: "card",
    limit: 1,
  });

  const pm = paymentMethods.data[0] ?? null;

  return NextResponse.json({
    paymentMethod: pm
      ? {
          brand: pm.card!.brand,
          last4: pm.card!.last4,
          exp_month: pm.card!.exp_month,
          exp_year: pm.card!.exp_year,
        }
      : null,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { userId, email } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const stripeCustomerId = await getOrCreateStripeCustomer(userId, email);

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${rootUrl}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
