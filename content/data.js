const slides = [
   {
    type: "text",
    title: "💡 Let's learn how LLMs work",
    content: `
<p>Welcome! In this walkthrough, we'll explore how <span class="highlight-gold">Large Language Models (LLMs)</span> like <strong>ChatGPT</strong> understand and generate text.</p>

<p>We'll break down each step — from how a prompt is <em>tokenized</em>, to how the model predicts and builds responses <span style="color:#0ff;">one token at a time</span>.</p>

<p>No AI background needed — just curiosity. <br/>Let's get started!</p>
`
  },
  {
    type: "card",
    title: "֎ General ChatGPT Flow",
    animate: "tokenized",
    label: "User sends prompt",
    content: `What's the capital of France?`,
    note: `
<p>When we ask ChatGPT something, we're giving it a <strong>prompt</strong>.</p>

<p>Before the model can understand it, our words are broken down into smaller pieces called <span class="highlight-gold">tokens</span>. This process is called <em>tokenization</em>.</p>

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
<p>Once the LLM understands our prompt, it starts generating a response — <strong>one token at a time</strong>.</p>

<p>It looks at everything it's seen so far (our question and its own previous words), and predicts the <em>most likely next token</em>.</p>

<p>In this example, it predicted <span class="highlight-gold">Paris</span> as the next most likely token.</p>

<p>It then adds that token to the context, and repeats the process — again and again — until it decides the answer is complete.</p>

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
<p>ChatGPT was trained on public data available before its training cutoff. That means it doesn’t automatically know our private files, documents, or internal tools.</p>

<p>It also can’t browse the internet or see new information unless it's built into its prompt.</p>

<p>But there's a clever workaround: <span class="highlight-gold">RAG</span>, or <strong>Retrieval-Augmented Generation</strong>.</p>

<p>With RAG, we can “teach” the model about our data by giving it access to external documents at the time of the question. These documents are retrieved, summarized, and added to the prompt — like giving the model a cheat sheet before it answers.</p>
`
  },
  {
  type: "card",
  title: "📊 How RAG Works (High-Level Overview)",
  label: "RAG Flow",
  animate: "typewriter",
  content: `
<span class="highlight-blue">User</span> Prompt
   ↓
Retriever (vector DB <span class="highlight-blue">search</span>)
   ↓
Relevant documents + Original Prompt
   ↓
LLM ➝ <span class="highlight-blue">Final</span> Answer
`
,
note: `
<p><span class="highlight-gold">Retrieval-Augmented Generation (RAG)</span> enhances an LLM by giving it access to our own data at runtime.</p>

<p><strong>User Prompt:</strong> We ask a question, like “What’s our refund policy?”</p>

<p><strong>Retriever:</strong> That question is turned into a vector and compared (using <em>cosine similarity</em>) to our documents stored in a vector database. The most relevant chunks are pulled back.</p>

<p><strong>Context Assembly:</strong> These relevant chunks are added to the original prompt, giving the LLM additional knowledge.</p>

<p><strong>Generator (LLM):</strong> The model receives this enriched prompt and generates a helpful answer — now grounded in our data.</p>

<p>This lets ChatGPT “look up” information without needing retraining — making it fast, flexible, and accurate for our needs.</p>
`
},


  {
    type: "image",
    title: `⚛ Vectors and Databases`,
    content: "assets/vector_no_background.png", // replace with your actual image path
  },

  {
    type: "text",
    title: "🔢 Vector Embeddings",
    content: `
    <p>Computers can't "understand" words like we do—they need numbers. That's where vector embeddings come in.</p>

    <p>A vector embedding is just a list of numbers that represents a word, sentence, or document.</p>
    
    <p>These numbers capture the meaning, context, and relationships between words, so that similar ideas end up with similar numbers.</p>

    <p>For example, the sentence "I love cats" might turn into something like:
    <br>🔢 [-0.05518227  0.01617802 -0.05773815  0.05592875 -0.00099338]... </br>
    </p>

    <p>This doesn't mean anything to us, but to the computer, it's a way to compare meanings. If another sentence like "I adore kittens" gets a similar set of numbers, the computer knows they're related.</p>

    <p>In short: vector embeddings let computers understand text by turning meaning into math.**</p>`
  },


{
    type: "text",
    title: "🛢️ Vector Database",
    content: `
    <p>A vector database is a special kind of database made for storing and searching vector embeddings.</p>

<p>In a regular database, we search for exact matches. For example, we might look up a person by their exact name or ID. But with a vector database, we're not searching for exact matches—we're searching for similar meanings.</p>

<p>Let’s say we want to find documents that are similar in meaning to the sentence <span class="highlight-gold"> “When did I submit a revenue report?”</span> A vector database takes the vector for that sentence and compares it with millions of other vectors to find the closest relevant context.</p>

<p>This is what makes vector databases powerful: They find related ideas, not just exact words. They’re essential for AI apps like search, chatbots, recommendation systems, and more—because they understand the meaning behind the text.</p>

<p>In the next slide, we'll see a 3D representation of what happens when you query a Vector Database</p>`
},


{
  type: "html",
  title: "📈 5D Representation of Vector Space",
  src: "vector_plot.html",  // relative path to your HTML file
  height: "500px",          // optional
  note: "The red diamond is our query and the graph shows where it lands in relation to other vectors.",
  height: "100vh" // takes 90% of viewport height
}







];
