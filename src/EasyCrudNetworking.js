export default async function postData(url, content = {}) {
  const response = await fetch(url, {
    method: content.method ? content.method : "get",
    headers: new Headers(content.headers),
    body: content.payload,
  });
  return response;
}
