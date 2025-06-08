const slides = [
  {
    type: "card",
    title: "General ChatGPT Flow",
    animate: "tokenized",
    label: "User sends prompt",
    content: `What's the capital of France?`,
    note: `
<p>
    Each <span class="highlight-gold"> token ID </span> maps to a learned subword unit that the LLM understands.
</p>
<p>
    These aren't always full words — they might be whole words, <br /> word parts <code>capi</code> <code>tal</code>, or even punctuation.
</p>
<p>
    These IDs are then passed on to the LLM to predict the next ID.
</p>
`
  },
  {
    type: "card",
    title: "🧠 LLM Decoding",
    animate: "reverse-token-flow",
    label: "ChatGPT sends back a response",
    content: `The capital of France is Paris.`,
    note: `
<p />The LLM generates responses one token at a time. 
<p />It looks at the prompt and previously generated tokens to predict the most likely next token.
<p />This process repeats — one prediction at a time — until the model finishes the full output.
`

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
