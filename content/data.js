const slides = [
  {
    type: "card",
    title: "General ChatGPT Flow",
    animate: "tokenized",
    label: "User sends prompt",
    content: `What's the capital of France?`
  },
  {
    type: "image",
    title: "Returned JSON from Action",
    content: "assets/screenshot-action-json.png"
  },
  {
    type: "text",
    title: "🧠 What is a Vector Database?",
    content: `
A **vector database** stores and searches numerical representations of data (embeddings) to enable semantic search.

In RAG, it allows the system to find relevant chunks of your documents before answering.
    `
  },
{
    type: "card",
    title: "🧪 New RAG Example",
    content: `{
  "input": "What vaccines are required?",
  "retriever": "Queries embedding DB",
  "generator": "Synthesizes answer with citation"
}`
  }








];
