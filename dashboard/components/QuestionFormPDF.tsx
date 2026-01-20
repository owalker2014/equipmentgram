import { InspectionFormWithId } from "@/lib/network/forms";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type Props = {
  data: InspectionFormWithId;
};

// const source =
//   "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap";

// Register font
// Font.register({ family: "Roboto", src: source });

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 14,
    fontFamily: "Helvetica",
  },
  section: {
    // paddingHorizontal: 10,
    marginTop: 10,
  },
  label: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    backgroundColor: "#dbeafe",
    fontWeight: "black",
  },
  label2: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    backgroundColor: "rgba(243 244 246, 1)",
    fontWeight: "black",
  },
  pageInfoContainer: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontWeight: "bold",
    backgroundColor: "#dbeafe",
  },
  pageTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 5,
  },
  image: {
    // width: "100%",
    height: 450,
    padding: 10,
  },
});

const QuestionFormPDF = ({ data }: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Item
            value={data.createdByUser?.display_name}
            label="Name of Inspector"
          />
          <Item value={data.nameOfBusiness} label="Business Name" />
          <Item
            // value={inspectionForm.dateOfInspection?.toDate().toLocaleDateString()}
            value={new Date(data.dateOfInspection)?.toLocaleDateString()}
            label="Date of Inspection"
          />
          <Item value={data.timeOfInspection} label="Time of Inspection" />
          <Item value={data.customerEmail} label="Customer's Email" />
          <Item
            value={
              <View>
                <View>
                  <Text>{data.address?.line1}</Text>
                </View>
                <View>
                  {data.address?.line2 && <Text>{data.address?.line2}</Text>}
                </View>
                <View>
                  <Text>
                    &nbsp;&nbsp;
                    {data.address?.city}, {data.address?.state}{" "}
                    {data.address?.zip}
                  </Text>
                </View>
              </View>
            }
            label="Address"
          />

          {data.form?.pages.map((page, index) => (
            <View key={`section-${index}`} style={styles.section}>
              <View style={styles.pageInfoContainer}>
                <Text style={styles.pageTitle}>{page.name}</Text>
                {page?.comment && <Text>{page.comment}</Text>}
              </View>

              {page.questions.map((question, index) => (
                <View key={`question-${index}`}>
                  {question.value && (
                    <Item value={question.value} label={question.label} />
                  )}
                  {question.comment && (
                    <Item value={question.comment} label={question.value!} />
                  )}
                  {question.imageUrl && (
                    <ImageItem src={question.imageUrl} label={question.label} />
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default QuestionFormPDF;

function Item({ value, label }: { value: any; label: string }) {
  return (
    <View>
      <View style={styles.label}>
        <Text>{label}:</Text>
      </View>
      <View style={styles.value}>
        <Text>{value}</Text>
      </View>
    </View>
  );
}

function ImageItem({ src, label }: { src: any; label: string }) {
  return (
    <View>
      <Text style={styles.label2}>{label}:</Text>
      <Image cache src={src} style={styles.image} />
    </View>
  );
}
