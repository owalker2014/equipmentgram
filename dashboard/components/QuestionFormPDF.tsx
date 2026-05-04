import { InspectionFormWithId } from "@/lib/network/forms";
import { analysisChecklist } from "@/utils/constants";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

type Props = {
  data: InspectionFormWithId;
};

// const source =
//   "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap";

// Register font
// Font.register({ family: "Roboto", src: source });

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  section: {
    // paddingHorizontal: 10,
    marginTop: 5,
    border: 1,
    borderTop: "none",
    borderStyle: "solid",
    borderColor: "#e5e7eb",
  },
  label: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    backgroundColor: "#dbeafe",
    fontWeight: "black",
  },
  label2: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    backgroundColor: "rgba(243 244 246, 1)",
    fontWeight: "black",
  },
  pageInfoContainer: {
    fontWeight: "bold",
    backgroundColor: "#dbeafe",
  },
  pageTitle: {
    fontFamily: "Helvetica-Bold",
    paddingHorizontal: 5,
    paddingVertical: 3,
    fontSize: 12,
    fontWeight: "bold",
  },
  pageComment: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    color: "#6b7280",
    fontSize: 10,
    backgroundColor: "#ffffff",
  },
  value: {
    paddingLeft: 7,
    paddingRight: 7,
    paddingVertical: 5,
    color: "#6b7280",
  },
  image: {
    // width: "100%",
    width: 200,
    height: 200,
    objectFit: "contain",
    padding: 10,
  },
  imageRow: {
    flexDirection: "row",
    gap: 12,
    margin: 4,
  },
  metadataContainer: {
    flex: 1,
    gap: 4,
  },
  metadataKeysRow: {
    flexDirection: "row",
    gap: 4,
  },
  metadataItem: {
    flex: 1,
    padding: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    borderRadius: 4,
  },
  metadataLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  metadataValue: {
    color: "#6b7280",
    fontSize: 10,
  },
});

const QuestionFormPDF = ({ data }: Props) => {
  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
        // renderTextLayer={false}
        // renderAnnotationLayer={false}
      >
        <View>
          <View style={styles.metadataKeysRow}>
            <View style={styles.metadataItem}>
              <Item
                value={data.createdByUser?.display_name}
                label="Name of Inspector"
              />
            </View>
            <View style={styles.metadataItem}>
              <Item value={data.nameOfBusiness} label="Business Name" />
            </View>
          </View>
          <View style={styles.metadataKeysRow}>
            <View style={styles.metadataItem}>
              <Item
                // value={inspectionForm.dateOfInspection?.toDate().toLocaleDateString()}
                value={new Date(data.dateOfInspection)?.toLocaleDateString()}
                label="Date of Inspection"
              />
            </View>
            <View style={styles.metadataItem}>
              <Item value={data.timeOfInspection} label="Time of Inspection" />
            </View>
          </View>
          <View style={styles.metadataKeysRow}>
            <View style={styles.metadataItem}>
              <Item
                value={
                  <View>
                    <View>
                      <Text>{data.address?.line1}</Text>
                    </View>
                    <View>
                      {data.address?.line2 && (
                        <Text>{data.address?.line2}</Text>
                      )}
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
            </View>
            <View style={styles.metadataItem}>
              <Item value={data.customerEmail} label="Customer Email" />
            </View>
          </View>

          {data.form?.pages.map((page, index) => (
            <View key={`section-${index}`} style={styles.section}>
              <View style={styles.pageInfoContainer}>
                <Text style={styles.pageTitle}>{page.name}</Text>
                {page?.comment && (
                  <Text style={styles.pageComment}>{page.comment}</Text>
                )}
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
                    <ImageItem
                      src={question.imageUrl}
                      label={question.label}
                      result={question.imageResult}
                    />
                    // <ImageItem
                    //   src={question.imageResult?.image_base64!}
                    //   label={question.label}
                    //   result={question.imageResult}
                    // />
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

function Item({ value, label }: { value: React.ReactNode; label: string }) {
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

function ImageItem({
  src,
  label,
  result,
}: {
  src: string;
  label: string;
  result: any;
}) {
  return (
    <View>
      <Text style={styles.label2}>{/* {label}: */}&nbsp;</Text>
      <View style={styles.imageRow}>
        <Image {...{ alt: "eq-image" }} cache src={src} style={styles.image} />
        <View style={styles.metadataContainer}>
          {analysisChecklist.map((o, oidx) => {
            if (o.keys) {
              return (
                <View key={oidx} style={styles.metadataKeysRow}>
                  {o.keys.map((x, xidx) => {
                    let output: any = result?.[x.key];
                    if (typeof output === "boolean") {
                      output = output ? "Yes" : "No";
                    }
                    return (
                      <View key={xidx} style={styles.metadataItem}>
                        <Text style={styles.metadataLabel}>{x.label}</Text>
                        <Text style={styles.metadataValue}>{output}</Text>
                      </View>
                    );
                  })}
                </View>
              );
            }

            return (
              <View key={oidx} style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>{o.label}</Text>
                <Text style={styles.metadataValue}>{result?.[o.key]}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
