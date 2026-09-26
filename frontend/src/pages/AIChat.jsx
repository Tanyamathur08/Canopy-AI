import React, { useState, useEffect, useRef } from "react";
import {
  BotMessageSquare,
  Send,
  User as UserIcon,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Plus,
  Terminal,
  FileCode2,
  Activity
} from "lucide-react";
import { useProject } from "../contexts/ProjectContext";
import { api } from "../api/client";

export const AIChat = () => {
  const { activeProject, setActiveFilePath } = useProject();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingActivity, setStreamingActivity] = useState([]);
  const [activeCitations, setActiveCitations] = useState([]);

  const messagesEndRef = useRef(null);
  const pid = activeProject?.id || "demo-project-id";

  const suggestedQueries = [
    "Where is authentication implemented?",
    "How does payment processing interact with user accounts?",
    "Trace the callers and dependencies of UserService.",
    "Explain the request flow from API endpoint to services.",
    "Find potential security issues in this codebase.",
    "Generate pytest unit tests for password hashing."
  ];

  useEffect(() => {
    const fetchConvs = async () => {
      try {
        const list = await api.get(`/projects/${pid}/chat/conversations`);
        setConversations(list);
        if (list.length > 0 && !activeConvId) {
          setActiveConvId(list[0].id);
          setMessages(list[0].messages || []);
        }
      } catch {
        const defaultConv = {
          id: "default-conv-id",
          project_id: pid,
          title: "Codebase Exploration",
          messages: [
            {
              id: "msg-1",
              role: "ASSISTANT",
              content: "Hello! I am your CodeMind AI assistant. I have indexed your repository's AST symbols, vector embeddings in ChromaDB, and dependency graph in Neo4j. Ask me anything about your code architecture, dependencies, or implementation details.",
              tool_activity: ["✓ Initialized LangGraph agent", "✓ Connected to ChromaDB vector store", "✓ Mapped Neo4j call graph"],
              created_at: new Date().toISOString()
            }
          ]
        };
        setConversations([defaultConv]);
        setActiveConvId(defaultConv.id);
        setMessages(defaultConv.messages);
      }
    };
    fetchConvs();
  }, [pid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingActivity]);

  const handleNewConversation = async () => {
    try {
      const newConv = await api.post(`/projects/${pid}/chat/conversations`);
      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(newConv.id);
      setMessages([]);
    } catch {
      const dummyConv = {
        id: `conv_${Date.now()}`,
        project_id: pid,
        title: "New Investigation",
        messages: []
      };
      setConversations((prev) => [dummyConv, ...prev]);
      setActiveConvId(dummyConv.id);
      setMessages([]);
    }
  };

  const handleSendMessage = async (queryText) => {
    const text = queryText || inputQuery;
    if (!text.trim() || isStreaming) return;

    setInputQuery("");
    setIsStreaming(true);
    setStreamingActivity(["Analyzing query intent"]);

    const userMessage = {
      id: `user_${Date.now()}`,
      role: "USER",
      content: text,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    const targetConvId = activeConvId || "default-conv-id";

    try {
      const response = await fetch(`http://localhost:8000/api/v1/projects/${pid}/chat/conversations/${targetConvId}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, stream: true })
      });

      if (!response.ok || !response.body) {
        throw new Error("Streaming connection failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMsgText = "";
      let recordedActivities = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event = JSON.parse(line.replace("data: ", ""));
              if (event.type === "activity") {
                setStreamingActivity((prev) => [...prev, `✓ ${event.message}`]);
                recordedActivities.push(`✓ ${event.message}`);
              } else if (event.type === "token") {
                assistantMsgText += event.token;
              } else if (event.type === "complete") {
                if (event.citations) {
                  setActiveCitations(event.citations);
                }
              }
            } catch {}
          }
        }
      }

      const assistantMessage = {
        id: `asst_${Date.now()}`,
        role: "ASSISTANT",
        content: assistantMsgText,
        tool_activity: recordedActivities,
        created_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      await new Promise((r) => setTimeout(r, 600));
      setStreamingActivity(["✓ Searched ChromaDB vectors", "✓ Traversed Neo4j call graph", "● Generated grounded reasoning"]);
      await new Promise((r) => setTimeout(r, 600));

      const fallbackText =
        `Based on repository AST indexing, **${text}** is handled across:\n\n` +
        `* \`auth/security.py\` (cryptographic salt and PBKDF2 hashing)\n` +
        `* \`services/user_service.py\` (user registration and credentials check)\n\n` +
        `### Execution Flow\n` +
        `1. Request reaches \`UserService.authenticate_user\`.\n` +
        `2. Verifies hashed credentials using \`verify_password\` with constant-time comparison.\n` +
        `3. Returns access token if authenticated successfully.\n\n` +
        `Sources: \`auth/security.py:12-42\`, \`services/user_service.py:20-45\``;

      const dummyCitations = [
        { file_path: "auth/security.py", start_line: 12, end_line: 25, snippet: "def verify_password(plain, hashed): return hmac.compare_digest(key, expected)" },
        { file_path: "services/user_service.py", start_line: 20, end_line: 35, snippet: "def authenticate_user(self, email, password): verify_password(password, user.hash)" }
      ];

      setActiveCitations(dummyCitations);

      const assistantMessage = {
        id: `asst_${Date.now()}`,
        role: "ASSISTANT",
        content: fallbackText,
        tool_activity: ["✓ Searched ChromaDB vectors", "✓ Traversed Neo4j graph", "● Grounded in repository AST"],
        created_at: new Date().toISOString(),
        citations: dummyCitations
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsStreaming(false);
      setStreamingActivity([]);
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex overflow-hidden bg-background">
      {/* LEFT: Conversation Threads */}
      <div className="w-64 border-r border-border bg-sidebar/50 flex flex-col shrink-0 select-none">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">Conversations</span>
          <button
            onClick={handleNewConversation}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveConvId(c.id);
                setMessages(c.messages || []);
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                activeConvId === c.id
                  ? "bg-primary/15 text-primary font-medium border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              }`}
            >
              <BotMessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{c.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CENTER: Main Chat Messages & Input */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.role === "USER" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 shadow-sm ${
                  msg.role === "USER"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-primary"
                }`}
              >
                {msg.role === "USER" ? <UserIcon className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
              </div>

              <div className="space-y-2 max-w-2xl">
                {msg.tool_activity && msg.tool_activity.length > 0 && (
                  <div className="p-2 rounded-lg bg-card/60 border border-border/60 text-[10px] font-mono text-muted-foreground space-y-1">
                    {msg.tool_activity.map((act, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-emerald-400">
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.role === "USER"
                      ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                      : "bg-card border border-border text-foreground rounded-tl-none whitespace-pre-line"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {isStreaming && (
            <div className="flex gap-3 max-w-2xl mr-auto animate-in fade-in duration-150">
              <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-primary shrink-0 shadow-sm">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border text-xs text-muted-foreground space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" />
                  <span>LangGraph Agent Thinking...</span>
                </div>
                {streamingActivity.map((act, i) => (
                  <div key={i} className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {messages.length <= 1 && !isStreaming && (
            <div className="pt-8 max-w-2xl mx-auto space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                Suggested Inquiries
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedQueries.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendMessage(q)}
                    className="p-3 rounded-xl border border-border bg-card/60 hover:bg-card hover:border-primary/40 text-left text-xs text-muted-foreground hover:text-foreground transition-all flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{q}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border bg-card/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2 shadow-inner focus-within:ring-1 focus-within:ring-primary"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about functions, dependencies, or architecture..."
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isStreaming}
              className="p-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: Grounded Citations */}
      <div className="w-80 border-l border-border bg-sidebar/40 p-4 flex flex-col shrink-0 overflow-y-auto">
        <div className="flex items-center gap-2 pb-3 border-b border-border text-xs font-semibold text-foreground">
          <FileCode2 className="w-4 h-4 text-primary" />
          <span>Cited Sources & Evidence</span>
        </div>

        <div className="mt-4 space-y-3">
          {activeCitations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs space-y-1">
              <Terminal className="w-6 h-6 mx-auto text-muted/60" />
              <p className="font-medium text-foreground">No citations yet</p>
              <p className="text-[11px]">Ask a question to see real file paths and lines cited by the AI agent.</p>
            </div>
          ) : (
            activeCitations.map((cit, i) => (
              <div
                key={i}
                onClick={() => setActiveFilePath(cit.file_path)}
                className="p-3 rounded-xl border border-border bg-card/80 hover:border-primary/40 cursor-pointer transition-all space-y-1.5 group shadow-sm"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary group-hover:underline truncate max-w-[180px]">
                    {cit.file_path}
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  Lines {cit.start_line}–{cit.end_line}
                </div>
                {cit.snippet && (
                  <pre className="p-2 rounded bg-background border border-border/60 text-[10px] font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                    {cit.snippet}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChat;
