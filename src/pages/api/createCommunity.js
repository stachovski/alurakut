import { SiteClient } from "datocms-client";

export default async function createCommunity(request, response) {
  const client = new SiteClient(process.env.DATO_CMS_TOKEN);

  async function createRecord() {
    const record = await client.items.create({
      itemType: "972033",
      ...request.body,
    });

    response.json({
      record: record,
    });
  }

  if (request.method === "POST") {
    return createRecord();
  }

  response.status(404).json({
    message: "Ainda não deu",
  });
}
