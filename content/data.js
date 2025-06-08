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
    type: "text",
    title: "📚 How ChatGPT Was Trained",
    content: `
<p>Before ChatGPT could answer questions, it went through a process called <strong>pretraining</strong>.</p>

<p>It was trained on a massive amount of public text from websites, books, articles, and more — basically anything written by humans that's available on the internet.</p>

<p>During this training, the model <strong><em>wasn't</em></strong> told what the "correct" answer was. Instead, it learned to guess the next word in a sentence over and over again. Kind of like a giant autocomplete — but much smarter.</p>

<p>By doing this billions of times, the model developed a strong sense of language patterns, grammar, facts, and even some reasoning skills.</p>
`
  },
  {
    type: "text",
    title: "🔒 Why ChatGPT Doesn't Know Your Data",
    content: `
<p>ChatGPT was trained on public data available before its training cutoff. That means it doesn’t automatically know your private files, documents, or internal tools.</p>

<p>It also can’t browse the internet or see new information unless it's built into its prompt.</p>

<p>But there's a clever workaround: <span class="highlight-gold">RAG</span>, or <strong>Retrieval-Augmented Generation</strong>.</p>

<p>With RAG, we can “teach” the model about your data by giving it access to external documents at the time of the question. These documents are retrieved, summarized, and added to the prompt — like giving the model a cheat sheet before it answers.</p>
`
  },
  {
  type: "card",
  title: "📊 How RAG Works (High-Level Overview)",
  label: "RAG Flow",
  content: `
<pre>
<span class="highlight-blue">User</span> Prompt
   ↓
Retriever (vector DB <span class="highlight-blue">search</span>)
   ↓
Relevant documents
   ↓
+ Original Prompt
   ↓
LLM ➝ <span class="highlight-blue">Final</span> Answer
</pre>
  `,
  note: `
    <p>This is a high-level view of how <span class="highlight-gold">Retrieval-Augmented Generation</span> works:</p>
    <ul>
      <li><strong>1. User Prompt:</strong> A question is asked.</li>
      <li><strong>2. Retriever:</strong> Searches your data (in a vector database) to find relevant information.</li>
      <li><strong>3. Context Assembly:</strong> The prompt and retrieved documents are combined.</li>
      <li><strong>4. Generator (LLM):</strong> Uses this combined context to generate a complete answer.</li>
    </ul>
    <p>This allows ChatGPT to answer questions using <em>your own data</em> — without retraining the model.</p>
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
