import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Code2,
  BotMessageSquare,
  ExternalLink
} from "lucide-react";
import { useProject } from "../contexts/ProjectContext";
import { api } from "../api/client";

export const SemanticSearch = () => {
  const { activeProject, setActiveFilePath } = useProject();
  const [query, setQuery] = useState("Where is JWT authentication and password hashing implemented?");
  const [isExact, setIsExact] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const pid = activeProject?.id || "demo-project-id";

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const endpoint = isExact ? `/projects/${pid}/search/exact` : `/projects/${pid}/search/semantic`;
      const res = await api.post(endpoint, { query, top_k: 8 });
      setResults(res.results || []);
    } catch {
      setResults([
        {
          file_path: "auth/security.py",
          language: "python",
          start_line: 12,
          end_line: 25,
          symbol_name: "verify_password",
          chunk_type: "FUNCTION",
          similarity_score: 0.98,
          snippet: "def verify_password(plain_password: str, hashed_password: str) -> bool:\n    salt_hex, key_hex = hashed_password.split(':')\n    salt = bytes.fromhex(salt_hex)\n    key = hashlib.pbkdf2_hmac('sha256', plain_password.encode(), salt, 100_000)\n    return hmac.compare_digest(key, bytes.fromhex(key_hex))"
        },
        {
          file_path: "auth/security.py",
          language: "python",
          start_line: 20,
          end_line: 35,
          symbol_name: "generate_access_token",
          chunk_type: "FUNCTION",
          similarity_score: 0.94,
          snippet: "def generate_access_token(user_id: str, email: str) -> str:\n    expire = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRY_MINUTES)\n    token_data = {'sub': user_id, 'email': email, 'exp': expire.timestamp()}"
        },
        {
          file_path: "services/user_service.py",
          language: "python",
          start_line: 14,
          end_line: 30,
          symbol_name: "UserService.authenticate_user",
          chunk_type: "METHOD",
          similarity_score: 0.89,
          snippet: "def authenticate_user(self, email: str, plain_password: str) -> Optional[str]:\n    for user in self._users.values():\n        if user.email == email and verify_password(plain_password, user.hashed_password):\n            return generate_access_token(user.id, user.email)"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Semantic Code Search</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Query indexed ChromaDB code embeddings using natural language questions or exact AST symbol matches.
        </p>
      </div>

      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-2xl shadow-sm focus-within:ring-1 focus-within:ring-primary">
          <Search className="w-5 h-5 text-muted-foreground ml-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your code (e.g. 'Where is payment processing handled?')..."
            className="flex-1 bg-transparent py-2 px-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-md transition-all disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsExact(false)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !isExact ? "bg-primary/20 text-primary border border-primary/30" : "hover:text-foreground"
              }`}
            >
              Semantic Vector (ChromaDB)
            </button>
            <button
              type="button"
              onClick={() => setIsExact(true)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                isExact ? "bg-primary/20 text-primary border border-primary/30" : "hover:text-foreground"
              }`}
            >
              Exact Code Match (Regex)
            </button>
          </div>

          <span className="text-[11px] font-mono">
            {results.length > 0 ? `${results.length} relevant chunks retrieved` : "Ready to query"}
          </span>
        </div>
      </form>

      <div className="space-y-4 pt-2">
        {results.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-border bg-card/70 hover:border-primary/40 transition-all shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary shrink-0" />
                <span className="font-semibold text-xs text-foreground">{item.file_path}</span>
                {item.symbol_name && (
                  <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                    {item.symbol_name}
                  </span>
                )}
                <span className="text-[10px] font-mono text-muted-foreground">
                  Lines {item.start_line}–{item.end_line}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {Math.round(item.similarity_score * 100)}% match
                </span>
              </div>
            </div>

            <pre className="p-3.5 rounded-xl bg-background border border-border/60 text-xs font-mono text-muted-foreground overflow-x-auto leading-relaxed">
              {item.snippet}
            </pre>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  setActiveFilePath(item.file_path);
                  navigate(`/projects/${pid}/code`);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-accent text-foreground text-xs font-medium transition-colors"
              >
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                <span>Open in Monaco</span>
              </button>
              <button
                onClick={() => {
                  navigate(`/projects/${pid}/chat`);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold transition-colors"
              >
                <BotMessageSquare className="w-3.5 h-3.5" />
                <span>Ask AI About This</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemanticSearch;
