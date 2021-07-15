import { SiteClient } from "datocms-client";

export default async function handleCommunities(request, response) {
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

  async function getRecords() {
    const record = await client.items.all({
        filter:{
            type: "972033"
        }
    });

    response.json({
      record: record,
    });
  }

  if (request.method === "POST") {
    return createRecord();
  }

  if (request.method === "GET") {
    return getRecords();
  }
  response.status(404).json({
    message: "Ainda não deu",
  });
}
