import React, { useEffect, useRef, useState } from "react";
import {
  FlaskConical,
  Box,
  NotebookPen,
  BookOpen,
  Route,
  Download,
  Upload,
  HardDrive,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Reactor from "./components/Reactor.jsx";
import Notebook, { downloadFile } from "./components/Notebook.jsx";
import { Evidence, NextExperiments } from "./components/Research.jsx";
import { presets, geometry } from "./domain/geometry.js";
import { validateBackup } from "./domain/data.js";
import { historicalRuns } from "./data.js";
import { sourceAsset } from "./assets.js";
const STORAGE = "mfc-workbench-v1";
function initialData() {
  const fresh = {
    schemaVersion: 1,
    config: { ...presets.clear500 },
    runs: structuredClone(historicalRuns),
  };
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE);
    return raw
      ? { ...validateBackup(JSON.parse(raw)), loadError: "" }
      : { ...fresh, loadError: "" };
  } catch (error) {
    return {
      ...fresh,
      loadError: raw
        ? "Saved data could not be read. Your old browser record has been preserved; export it before replacing it."
        : "Browser storage is unavailable. Export a JSON backup to preserve your work.",
      raw,
    };
  }
}
export default function App() {
  const [initial] = useState(initialData),
    [config, setConfig] = useState(initial.config),
    [runs, setRuns] = useState(initial.runs),
    [page, setPage] = useState("reactor"),
    [selectedId, setSelectedId] = useState(null),
    [saveState, setSaveState] = useState(
      initial.loadError ? "blocked" : "saved",
    ),
    [message, setMessage] = useState(initial.loadError || ""),
    [blocked, setBlocked] = useState(Boolean(initial.loadError));
  const upload = useRef(null);
  useEffect(() => {
    if (blocked) return;
    try {
      const data = { schemaVersion: 1, config, runs };
      validateBackup(data);
      localStorage.setItem(STORAGE, JSON.stringify(data));
      setSaveState("saved");
    } catch (e) {
      setSaveState("error");
      setMessage(
        "Browser save failed: " +
          e.message +
          ". Export a JSON backup to preserve your work.",
      );
    }
  }, [config, runs, blocked]);
  const newRun = (proposal) => {
    if (proposal?.nativeEvent) proposal = null;
    const g = geometry(config),
      id = "MFC-" + crypto.randomUUID().slice(0, 8).toUpperCase();
    const run = {
      id,
      title: proposal?.title || "Bottle baseline",
      kind: "new",
      status: "planned",
      createdAt: new Date().toISOString(),
      date: null,
      config: structuredClone(config),
      workingVolumeM3: g.liquid || null,
      volumeBasis: "calculated",
      electrodes: `Graphite option: ${(config.rodRadius * 2000).toFixed(1)} mm diameter × ${(config.rodHeight * 1000).toFixed(1)} mm. ${config.anodeCount} anode and ${config.cathodeCount} cathode rods; ${(config.electrodeGap * 1000).toFixed(1)} mm surface gap. Confirm materials.`,
      inoculum: "",
      feedstock: "",
      environment: "",
      instrument: "",
      controls: proposal?.controls || "",
      deviations: "",
      observations: "",
      interpretation: proposal
        ? `Planned hypothesis: ${proposal.mechanism}\nProposed test: ${proposal.protocol}\nNo observations collected.`
        : "",
      readings: [],
    };
    setRuns((r) => [...r, run]);
    setSelectedId(id);
    setPage("notebook");
  };
  const backup = () =>
    downloadFile(
      "mfc-workbench-backup.json",
      JSON.stringify(
        {
          schemaVersion: 1,
          exportedAt: new Date().toISOString(),
          config,
          runs,
        },
        null,
        2,
      ),
    );
  const restore = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 20e6) throw new Error("Backup is larger than 20 MB.");
      const data = validateBackup(JSON.parse(await file.text()));
      const current = { schemaVersion: 1, config, runs };
      downloadFile("mfc-before-restore.json", JSON.stringify(current, null, 2));
      if (initial.raw)
        downloadFile("mfc-unreadable-original.txt", initial.raw, "text/plain");
      setBlocked(false);
      setConfig(data.config);
      setRuns(data.runs);
      setSelectedId(null);
      setMessage(
        "Backup restored. A copy of your previous working data was downloaded first.",
      );
    } catch (err) {
      setMessage("Could not restore: " + err.message);
    } finally {
      e.target.value = "";
    }
  };
  const navigation = [
    ["reactor", "Reactor", Box],
    ["notebook", "Notebook", NotebookPen],
    ["evidence", "Evidence", BookOpen],
    ["experiments", "Next experiments", Route],
  ];
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to workspace
      </a>
      <aside className="navigation">
        <div className="brand">
          <div className="brand-symbol">
            <FlaskConical size={23} />
          </div>
          <div>
            <strong>MFC</strong>
            <span>Research workbench</span>
          </div>
        </div>
        <nav aria-label="Workbench">
          {navigation.map(([id, label, Icon]) => (
            <button
              key={id}
              className={page === id ? "nav-item active" : "nav-item"}
              aria-current={page === id ? "page" : undefined}
              onClick={() => {
                setPage(id);
                if (id === "notebook") setSelectedId(null);
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="project-note">
          <strong>Small reactor. Better evidence.</strong>
          <p>Build a baseline before optimizing biology or scaling up.</p>
          <span>0.5–1 L research direction</span>
        </div>
        <div className="local-note">
          <HardDrive size={16} />
          <span>
            Local workspace
            <br />
            <small>Your data stays in this browser</small>
          </span>
        </div>
      </aside>
      <div className="workspace">
        <header className="app-header">
          <span>
            MFC project <span className="slash">/</span>{" "}
            {navigation.find((x) => x[0] === page)?.[1]}
          </span>
          <div className="header-actions">
            <span
              className={`save-status ${saveState === "saved" ? "" : "unsaved"}`}
            >
              {saveState === "saved" ? (
                <CheckCircle2 size={14} />
              ) : (
                <AlertCircle size={14} />
              )}{" "}
              {saveState === "saved" ? "Saved locally" : "Save needs attention"}
            </span>
            <button className="header-button" aria-label="Backup" onClick={backup}>
              <Download size={15} />
              <span>Backup</span>
            </button>
            <button
              className="header-button"
              aria-label="Restore"
              onClick={() => upload.current.click()}
            >
              <Upload size={15} />
              <span>Restore</span>
            </button>
            <input
              ref={upload}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={restore}
            />
          </div>
        </header>
        {message && (
          <div className="app-message" role="status">
            <span>{message}</span>
            <div>
              {blocked && (
                <button
                  onClick={() =>
                    downloadFile(
                      "mfc-unreadable-original.txt",
                      initial.raw || "",
                      "text/plain",
                    )
                  }
                >
                  Export preserved data
                </button>
              )}
              <button
                aria-label="Dismiss message"
                onClick={() => setMessage("")}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        <main id="main">
          {page === "reactor" && (
            <Reactor config={config} setConfig={setConfig} onNewRun={newRun} />
          )}{" "}
          {page === "notebook" && (
            <Notebook
              runs={runs}
              setRuns={setRuns}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onNewRun={newRun}
            />
          )}{" "}
          {page === "evidence" && <Evidence />}{" "}
          {page === "experiments" && <NextExperiments onNewRun={newRun} />}
        </main>
        <footer className="app-footer">
          <span>Original notes preserved · assumptions visible</span>
          <a href={sourceAsset("/sources/phase-0.md")} target="_blank" rel="noreferrer">
            Research assessment · 11 Oct 2026
          </a>
        </footer>
      </div>
    </div>
  );
}
