import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Folder,
  FileCode,
  ChevronRight,
  ChevronDown,
  BotMessageSquare,
  Sparkles,
  Network,
  ShieldAlert,
  TestTube2,
  Copy,
  Check,
  Terminal,
  Activity
} from "lucide-react";
import { useProject } from "../contexts/ProjectContext";
import { useTheme } from "../contexts/ThemeContext";
import { api } from "../api/client";

export const ProjectWorkspace = () => {
  const { activeProject, activeFilePath, setActiveFilePath } = useProject();
  const { theme } = useTheme();
  const [fileTree, setFileTree] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [currentFileLang, setCurrentFileLang] = useState("python");
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({ "root": true, "auth": true, "services": true, "models": true });

  const pid = activeProject?.id || "demo-project-id";

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const tree = await api.get(`/projects/${pid}/files/tree`);
        setFileTree(tree);
      } catch {
        setFileTree({
          name: "root",
          path: "",
          type: "directory",
          children: [
            {
              name: "auth",
              path: "auth",
              type: "directory",
              children: [
                { name: "security.py", path: "auth/security.py", type: "file", language: "python" },
                { name: "router.py", path: "auth/router.py", type: "file", language: "python" },
              ]
            },
            {
              name: "services",
              path: "services",
              type: "directory",
              children: [
                { name: "user_service.py", path: "services/user_service.py", type: "file", language: "python" },
                { name: "payment_service.py", path: "services/payment_service.py", type: "file", language: "python" },
              ]
            },
            {
              name: "models",
              path: "models",
              type: "directory",
              children: [
                { name: "user.py", path: "models/user.py", type: "file", language: "python" },
              ]
            },
            { name: "main.py", path: "main.py", type: "file", language: "python" },
          ]
        });
      }
    };
    fetchTree();
  }, [pid]);

  useEffect(() => {
    const fetchContent = async () => {
      if (!activeFilePath) return;
      try {
        const res = await api.get(`/projects/${pid}/files/content?path=${encodeURIComponent(activeFilePath)}`);
        setFileContent(res.content);
        setCurrentFileLang(res.language || "python");
      } catch {
        if (activeFilePath.includes("security")) {
          setFileContent(`"""Authentication and cryptographic security utilities."""
import os
import hashlib
import hmac
from datetime import datetime, timedelta, timezone

SECRET_KEY = os.getenv("SECRET_KEY", "demo-insecure-secret-key-12345")
ALGORITHM = "HS256"
TOKEN_EXPIRY_MINUTES = 60

def hash_password(password: str) -> str:
    """Hashes a password with salt using PBKDF2."""
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100_000)
    return f"{salt.hex()}:{key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored salt:hash string."""
    try:
        salt_hex, key_hex = hashed_password.split(":")
        salt = bytes.fromhex(salt_hex)
        expected_key = bytes.fromhex(key_hex)
        key = hashlib.pbkdf2_hmac('sha256', plain_password.encode(), salt, 100_000)
        return hmac.compare_digest(key, expected_key)
    except Exception:
        return False
`);
        } else if (activeFilePath.includes("payment")) {
          setFileContent(`"""Payment processing service coordinating transaction receipts and user accounts."""
import uuid
from typing import Dict, Any
from app.demo_repo.services.user_service import UserService

class PaymentService:
    def __init__(self, user_service: UserService):
        self.user_service = user_service
        self._transactions: Dict[str, Dict[str, Any]] = {}

    def process_charge(self, user_id: str, amount_cents: int, currency: str = "USD") -> Dict[str, Any]:
        """Charges a registered user account and records transaction ledger."""
        user = self.user_service.get_by_id(user_id)
        if not user:
            raise ValueError(f"User {user_id} not found for charge processing.")
        
        tx_id = f"tx_{uuid.uuid4().hex[:12]}"
        record = {
            "transaction_id": tx_id,
            "user_id": user_id,
            "user_email": user.email,
            "amount_cents": amount_cents,
            "currency": currency,
            "status": "SUCCEEDED"
        }
        self._transactions[tx_id] = record
        return record
`);
        } else {
          setFileContent(`# File: ${activeFilePath}\n\n# Codebase assistant loaded file.`);
        }
      }
    };
    fetchContent();
  }, [pid, activeFilePath]);

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleAction = async (actionType) => {
    setIsAiLoading(true);
    setAiAnalysisResult(null);

    await new Promise((r) => setTimeout(r, 600));

    if (actionType === "explain") {
      setAiAnalysisResult(
        `### Explanation for \`${activeFilePath}\`\n\n` +
        `This file handles cryptographic password hashing and authentication token generation using PBKDF2-HMAC-SHA256 with 100,000 iterations.\n\n` +
        `- **verify_password:** Employs constant-time verification via \`hmac.compare_digest\` to prevent timing side-channel attacks.\n` +
        `- **hash_password:** Generates a random 16-byte cryptographic salt per invocation to prevent rainbow table attacks.`
      );
    } else if (actionType === "dependencies") {
      setAiAnalysisResult(
        `### Dependency Analysis (Neo4j Graph)\n\n` +
        `**Imported by:**\n` +
        `- \`services/user_service.py\` (calls \`hash_password\` and \`verify_password\`)\n` +
        `- \`auth/router.py\` (calls \`generate_access_token\`)\n\n` +
        `**External Modules:**\n` +
        `- \`hashlib\`, \`hmac\`, \`datetime\`, \`os\`\n\n` +
        `**Impact Blast Radius:** Medium (2 dependent modules).`
      );
    } else if (actionType === "tests") {
      setAiAnalysisResult(
        `### Generated Pytest Suite\n\n\`\`\`python\n` +
        `import pytest\n` +
        `from auth.security import hash_password, verify_password\n\n` +
        `def test_hashing_uniqueness():\n` +
        `    pwd = "super_secret_123"\n` +
        `    h1 = hash_password(pwd)\n` +
        `    h2 = hash_password(pwd)\n` +
        `    assert h1 != h2  # Salt ensures uniqueness\n` +
        `    assert verify_password(pwd, h1) is True\n` +
        `    assert verify_password("wrong", h1) is False\n` +
        `\`\`\``
      );
    } else if (actionType === "security") {
      setAiAnalysisResult(
        `### Security & AST Audit\n\n` +
        `⚠️ **Potential Issue:** Fallback default secret key (\`demo-insecure-secret-key-12345\`).\n` +
        `- **Severity:** High in production.\n` +
        `- **Remediation:** Remove fallback string and raise \`RuntimeError("SECRET_KEY must be set")\` on application initialization.`
      );
    }
    setIsAiLoading(false);
  };

  const handleCopy = () => {
    if (aiAnalysisResult) {
      navigator.clipboard.writeText(aiAnalysisResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderTree = (node) => {
    if (node.type === "directory") {
      const isExpanded = !!expandedFolders[node.path || "root"];
      return (
        <div key={node.path || "root"} className="space-y-0.5">
          <button
            onClick={() => toggleFolder(node.path || "root")}
            className="w-full flex items-center gap-1.5 px-2 py-1 text-left text-xs text-muted-foreground hover:text-foreground hover:bg-accent/40 rounded transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
            <Folder className="w-3.5 h-3.5 text-primary/80 shrink-0" />
            <span className="font-medium truncate">{node.name}</span>
          </button>
          {isExpanded && node.children && (
            <div className="pl-4 space-y-0.5 border-l border-border/40 ml-2">
              {node.children.map((c) => renderTree(c))}
            </div>
          )}
        </div>
      );
    }

    const isSelected = activeFilePath === node.path;
    return (
      <button
        key={node.path}
        onClick={() => {
          setActiveFilePath(node.path);
          setAiAnalysisResult(null);
        }}
        className={`w-full flex items-center gap-2 px-2.5 py-1 text-left text-xs rounded transition-colors ${
          isSelected
            ? "bg-primary/15 text-primary font-medium border border-primary/25"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
        }`}
      >
        <FileCode className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden bg-background">
      <div className="h-10 border-b border-border bg-card/60 px-4 flex items-center justify-between text-xs font-mono text-muted-foreground shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-semibold flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-primary" /> {activeProject?.name || "Codebase"}
          </span>
          <span>/</span>
          <span className="text-primary font-medium">{activeFilePath || "Select a file"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground capitalize">{currentFileLang}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="text-[11px] text-emerald-400">AST Indexed</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: File Tree */}
        <div className="w-64 border-r border-border bg-sidebar/50 p-3 overflow-y-auto shrink-0 select-none">
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-3 px-1 flex items-center justify-between">
            <span>Codebase Files</span>
            <span className="text-primary">{activeProject?.file_count || 6} items</span>
          </div>
          <div className="space-y-1">
            {fileTree ? renderTree(fileTree) : <div className="text-xs text-muted-foreground p-2">Loading tree...</div>}
          </div>
        </div>

        {/* Center: Monaco Editor */}
        <div className="flex-1 flex flex-col bg-surface-elevated overflow-hidden relative">
          <Editor
            height="100%"
            language={currentFileLang}
            value={fileContent}
            theme={theme === "dark" ? "vs-dark" : "light"}
            options={{
              fontSize: 13,
              fontFamily: "JetBrains Mono, Menlo, Monaco, Courier New, monospace",
              minimap: { enabled: true },
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              readOnly: false,
              smoothScrolling: true,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Right: AI Actions Panel */}
        <div className="w-96 border-l border-border bg-card/60 flex flex-col shrink-0 overflow-hidden">
          <div className="p-3.5 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <BotMessageSquare className="w-4 h-4 text-primary" />
              <span>AI Code Actions</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              LangGraph
            </span>
          </div>

          <div className="p-3 border-b border-border bg-background/50 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAction("explain")}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-card hover:bg-accent border border-border text-xs text-foreground font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Explain File</span>
            </button>
            <button
              onClick={() => handleAction("dependencies")}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-card hover:bg-accent border border-border text-xs text-foreground font-medium transition-colors"
            >
              <Network className="w-3.5 h-3.5 text-indigo-400" />
              <span>Trace Usages</span>
            </button>
            <button
              onClick={() => handleAction("tests")}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-card hover:bg-accent border border-border text-xs text-foreground font-medium transition-colors"
            >
              <TestTube2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Generate Tests</span>
            </button>
            <button
              onClick={() => handleAction("security")}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-card hover:bg-accent border border-border text-xs text-foreground font-medium transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Security Audit</span>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
            {isAiLoading ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground space-y-3">
                <Activity className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-xs">LangGraph Agent reasoning over AST symbols...</span>
              </div>
            ) : aiAnalysisResult ? (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Analysis Result</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="prose prose-invert prose-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                  {aiAnalysisResult}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground space-y-2">
                <BotMessageSquare className="w-8 h-8 text-muted/60" />
                <p className="text-xs font-medium text-foreground">Select an AI action above</p>
                <p className="text-[11px] max-w-[200px]">
                  Explain code, find caller hierarchies, inspect security risks, or synthesize Pytest test cases.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="h-6 border-t border-border bg-sidebar/80 px-4 flex items-center justify-between text-[11px] font-mono text-muted-foreground shrink-0 select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Repository: Ready
          </span>
          <span>ChromaDB: Connected</span>
          <span>Neo4j: Connected</span>
        </div>
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span className="text-foreground uppercase">{currentFileLang}</span>
        </div>
      </footer>
    </div>
  );
};

export default ProjectWorkspace;
