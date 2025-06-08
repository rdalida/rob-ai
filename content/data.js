const slides = [
   {
    type: "text",
    title: "💡 Let's learn how LLMs work",
    content: `
<p>Welcome! In this walkthrough, we'll explore how <span class="highlight-gold">Large Language Models (LLMs)</span> like <strong>ChatGPT</strong> understand and generate text.</p>

<p>We'll break down each step — from how your prompt is <em>tokenized</em>, to how the model predicts and builds responses <span style="color:#0ff;">one token at a time</span>.</p>

<p>No AI background needed — just curiosity. <br/>Let's get started!</p>
`
  },
  {
    type: "card",
    title: "General ChatGPT Flow",
    animate: "tokenized",
    label: "User sends prompt",
    content: `What's the capital of France?`,
    note: `
<p>When you ask ChatGPT something, you're giving it a <strong>prompt</strong>.</p>

<p>Before the model can understand it, your words are broken down into smaller pieces called <span class="highlight-gold">tokens</span>. This process is called <em>tokenization</em>.</p>

<p>Each token is converted into a unique number called a <span class="highlight-gold">token ID</span>. These aren't always full words — they might be whole words, parts of words like <code>capi</code> and <code>tal</code>, or even just punctuation.</p>

<p>These token IDs are what the model actually sees. It uses them to predict what comes next — one token at a time.</p>
`
  },
  {
    type: "card",
    title: "🧠 LLM Decoding",
    animate: "reverse-token-flow",
    label: "ChatGPT sends back a response",
    content: `The capital of France is Paris.`,
    note: `
<p>Once the LLM understands your prompt, it starts generating a response — <strong>one token at a time</strong>.</p>

<p>It looks at everything it's seen so far (your question and its own previous words), and predicts the <em>most likely next token</em>.</p>

<p>Then it adds that token to the context, and repeats the process — again and again — until it decides the answer is complete.</p>
`
  },
  {
    type: "image",
    title: "Returned JSON from Action",
    content: "assets/screenshot-action-json.png"
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
