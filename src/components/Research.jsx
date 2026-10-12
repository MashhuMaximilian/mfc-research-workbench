import React, { useMemo, useState } from "react";
import {
  Search,
  ExternalLink,
  Download,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { sources, facts, uncertainties, proposals } from "../data.js";
import { sourceAsset, localArchiveAvailable } from "../assets.js";
export function SourceLinks({ ids }) {
  return (
    <span className="source-links">
      {ids.map((id) => {
        const s = sources.find((x) => x.id === id);
        return s ? (
          <a
            key={id}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            title={s.title}
          >
            {id}
            <ExternalLink size={10} />
          </a>
        ) : (
          <span key={id}>{id}</span>
        );
      })}
    </span>
  );
}
export function Evidence() {
  const [tab, setTab] = useState("summary"),
    [query, setQuery] = useState(""),
    [kind, setKind] = useState("all");
  const filtered = sources.filter(
    (s) =>
      (kind === "all" || s.type === kind) &&
      `${s.id} ${s.title} ${s.summary} ${s.status}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Research evidence</h1>
          <p>The original material, what it supports, and what remains open.</p>
        </div>
        <a className="button" href={sourceAsset("/sources/phase-0.md")} download>
          <Download size={16} /> Download assessment
        </a>
      </div>
      <div className="page-tabs" role="tablist" aria-label="Evidence sections">
        {[
          ["summary", "Research summary"],
          ["sources", "Source register"],
          ["facts", "Extracted facts"],
          ["uncertainties", "Open questions"],
        ].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
          >
            {label}
            {id === "sources" && <span>{sources.length}</span>}
            {id === "uncertainties" && <span>{uncertainties.length}</span>}
          </button>
        ))}
      </div>
      {tab === "summary" && (
        <div className="research-summary">
          <article>
            <h2>Start with a reproducible bottle-scale baseline.</h2>
            <p>
              Your materials describe a real exploratory micro-scale test and a
              separate bottle concept. They offer a useful starting record, but
              do not yet establish usable power, a validated separator, or a
              biological electron-transfer mechanism.
            </p>
            <div className="design-comparison">
              <figure>
                <img
                  src={sourceAsset("/sources/S07-meter-positive.jpg")}
                  alt="Historical micro-scale electrode assembly beside a multimeter"
                />
                <figcaption>
                  <strong>Historical micro-scale assembly</strong>
                  <span>Frame and graphite leads · S01, S06, S07, S08</span>
                </figcaption>
              </figure>
              <figure>
                <img
                  src={sourceAsset("/sources/S05-reactor-drawing.jpg")}
                  alt="Your single-chamber air-cathode reactor sketch"
                />
                <figcaption>
                  <strong>Proposed bottle reactor</strong>
                  <span>0.5–1 L current target · S02–S05, N01</span>
                </figcaption>
              </figure>
            </div>
            <h3>The observations worth carrying forward</h3>
            <p>
              The Notion tables record 15 voltage conditions, some ambiguous
              current displays, pressure-dependent changes and a mold
              observation. They have no recoverable measurement dates, external
              loads or independent replicate counts. The notebook preserves
              those limits. <SourceLinks ids={["N01", "S06", "S07"]} />
            </p>
            <h3>Separate a separator from a proven membrane</h3>
            <p>
              The PE / coffee-filter / PE arrangement around silicone is a
              proposal. Its liquid permeability, ionic transport, selectivity
              and durability are not measured. The drawing and Notion disagree
              on vitamin-C concentration. It needs characterization before “PEM”
              is a supported description.{" "}
              <SourceLinks ids={["S05", "N01", "L02", "L05"]} />
            </p>
            <h3>The cathode is an interface to test</h3>
            <p>
              The drawing connects a graphite/cloth bundle to air openings, but
              does not resolve the liquid seal, catalyst, wetting or
              oxygen-reduction performance. The model makes this gap visible as
              a removable schematic patch. <SourceLinks ids={["S05", "L01"]} />
            </p>
            <h3>Correct the energy estimate before scaling</h3>
            <p>
              The shared AI calculation yields 0.012–0.12 Wh/day under its own
              assumptions, then reports 1–50 Wh/day. That increase has no
              support. Soil, household and septic concepts remain future
              research directions; no output forecast is carried into this
              model. <SourceLinks ids={["A01", "D01", "D02"]} />
            </p>
            <h3>A useful route toward a PhD question</h3>
            <p>
              Document a stable measurement protocol, test the cathode’s
              physical interface, then compare controlled baselines. Only after
              repeatability is established should you optimize materials or
              culture selection. The broad idea is a research direction;
              originality still needs a focused literature review and supervisor
              input.
            </p>
          </article>
          <aside className="research-aside">
            <h2>What we have</h2>
            <dl>
              <dt>8</dt>
              <dd>Supplied photos and screenshots</dd>
              <dt>2</dt>
              <dd>Notion pages</dd>
              <dt>2</dt>
              <dd>Distinct Google documents</dd>
              <dt>1</dt>
              <dd>Shared AI conversation</dd>
            </dl>
            <p>
              Duplicate tabs count once. No CAD source or scale reference was
              found in the initially empty workspace.
            </p>
            <h3>Source copies</h3>
            <a href={sourceAsset(localArchiveAvailable ? "/sources/inventory.json" : "/sources/public-inventory.json")} download>
              File inventory and SHA-256 hashes <Download size={13} />
            </a>
            <a href={sourceAsset("/sources/phase-0.md")} download>
              Inventory, summary and architecture <Download size={13} />
            </a>
            <h3>Evidence labels</h3>
            <p>
              <strong>Source-reported</strong> preserves your original notes.{" "}
              <strong>Provisional</strong> identifies assumptions.{" "}
              <strong>Calculated</strong> identifies arithmetic. Published
              studies are linked with their limitations.
            </p>
            <h3>First useful measurements</h3>
            <ul>
              <li>Internal diameter and body height</li>
              <li>Shoulder and neck dimensions</li>
              <li>Actual water-fill capacity</li>
              <li>Graphite diameter and length</li>
              <li>Load resistance and meter range</li>
            </ul>
          </aside>
        </div>
      )}
      {tab === "sources" && (
        <>
          <div className="filters">
            <label className="search-field">
              <Search size={17} />
              <input
                aria-label="Search sources"
                placeholder="Search sources, materials, or claims"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select
              aria-label="Source type"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
            >
              <option value="all">All source types</option>
              {[...new Set(sources.map((s) => s.type))].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="source-register">
            {filtered.map((s) => (
              <article className="source-row" key={s.id}>
                {s.type === "Image" || s.type === "Drawing" ? (
                  <a href={s.url} target="_blank" rel="noreferrer">
                    <img src={s.url} alt={s.title} loading="lazy" />
                  </a>
                ) : (
                  <span className="source-code">{s.id}</span>
                )}
                <div>
                  <div className="source-title">
                    <h2>{s.title}</h2>
                    <span className="tag">{s.status}</span>
                  </div>
                  <p>{s.summary}</p>
                  <small>
                    {s.id} · {s.type}
                  </small>
                </div>
                <div className="source-actions">
                  <a href={s.url} target="_blank" rel="noreferrer">
                    Open <ArrowUpRight size={15} />
                  </a>
                  {s.local && (
                    <a href={s.local} download>
                      Local copy <Download size={13} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          {!filtered.length && (
            <p className="empty-note">
              No source matches. Clear your search or choose another source
              type.
            </p>
          )}
        </>
      )}
      {tab === "facts" && (
        <div className="facts-list">
          {facts.map((f) => (
            <article key={f.id}>
              <div>
                <span className="source-code">{f.id}</span>
                <span className="tag">{f.kind}</span>
              </div>
              <p>{f.text}</p>
              <SourceLinks ids={f.sources} />
            </article>
          ))}
        </div>
      )}
      {tab === "uncertainties" && (
        <div className="uncertainty-list">
          {uncertainties.map(([id, title, question, resolve, refs]) => (
            <article key={id}>
              <div className="uncertainty-title">
                <span>{id}</span>
                <h2>{title}</h2>
                <span className="tag amber">Unresolved</span>
              </div>
              <p>{question}</p>
              <div className="resolution">
                <strong>Next evidence to collect</strong>
                <p>{resolve}</p>
                <SourceLinks ids={refs.split(", ")} />
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
export function NextExperiments({ onNewRun }) {
  const [weights, setWeights] = useState({
      cost: 1,
      time: 1,
      feasibility: 2,
      uncertainty: 1,
      information: 3,
    }),
    [selected, setSelected] = useState("EXP-01");
  const ranked = useMemo(
    () =>
      proposals
        .map((p) => ({
          ...p,
          score:
            Object.entries(weights).reduce(
              (sum, [key, w]) => sum + p.scores[key] * w,
              0,
            ) / Object.values(weights).reduce((a, b) => a + b, 0),
        }))
        .sort((a, b) => b.score - a.score),
    [weights],
  );
  const p = proposals.find((p) => p.id === selected);
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Next experiments</h1>
          <p>Small tests that make the next decision easier.</p>
        </div>
        <span className="tag amber">Proposals · outcomes unknown</span>
      </div>
      <div className="priority-intro">
        <h2>First earn confidence in the measurement.</h2>
        <p>
          Default priorities favor interpretable data and feasible bench work.
          Ratings are provisional judgments, not measured costs, durations or
          information gain. Change the weights to see how the ordering responds.
        </p>
      </div>
      <div className="weights">
        {Object.entries(weights).map(([key, v]) => (
          <label key={key}>
            <span>
              {key === "uncertainty"
                ? "Uncertainty reduced"
                : key === "information"
                  ? "Information gained"
                  : key[0].toUpperCase() + key.slice(1)}{" "}
              <b>{v}</b>
            </span>
            <input
              aria-label={`${key} priority weight`}
              type="range"
              min="1"
              max="5"
              value={v}
              onChange={(e) =>
                setWeights({ ...weights, [key]: Number(e.target.value) })
              }
            />
          </label>
        ))}
      </div>
      <div className="proposal-layout">
        <section className="proposal-ranking">
          <div className="ranking-header">
            <span>Suggested order</span>
            <span>Score / 5</span>
          </div>
          {ranked.map((item, i) => (
            <button
              className={
                selected === item.id ? "proposal-row active" : "proposal-row"
              }
              key={item.id}
              onClick={() => setSelected(item.id)}
            >
              <span className="rank">{i + 1}</span>
              <div>
                <strong>{item.title}</strong>
                <span>{item.time}</span>
              </div>
              <b>{item.score.toFixed(2)}</b>
            </button>
          ))}
          <details className="score-explanation">
            <summary>How the ranking is calculated</summary>
            <p>
              Score = Σ (rating × weight) / Σ weights. Ratings range 1–5; higher
              cost/time ratings mean cheaper/faster. Feasibility, uncertainty
              reduction and information ratings are higher when more favorable.
              All are initial estimates; no prices or biological duration are
              invented.
            </p>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Proposal</th>
                    {Object.keys(weights).map((k) => (
                      <th key={k}>{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {proposals.map((x) => (
                    <tr key={x.id}>
                      <td>{x.id}</td>
                      {Object.keys(weights).map((k) => (
                        <td key={k}>{x.scores[k]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>
        <article className="proposal-detail">
          <div className="section-heading">
            <h2>{p.title}</h2>
            <span className="tag">{p.id}</span>
          </div>
          <dl>
            <dt>Proposed mechanism</dt>
            <dd>{p.mechanism}</dd>
            <dt>Evidence to read</dt>
            <dd>
              <SourceLinks ids={p.sources} />
              <p>
                Source setups and materials differ; a linked paper does not
                validate this reactor.
              </p>
            </dd>
            <dt>Expected effect and limits</dt>
            <dd>{p.effect}</dd>
            <dt>Keep controlled</dt>
            <dd>{p.controls}</dd>
            <dt>Small experiment</dt>
            <dd>{p.protocol}</dd>
            <dt>Evidence supporting it</dt>
            <dd>{p.supports}</dd>
            <dt>Evidence against it</dt>
            <dd>{p.contradicts}</dd>
            <dt>Resources and time</dt>
            <dd>
              {p.cost}. {p.time}.
            </dd>
          </dl>
          <button className="primary" onClick={() => onNewRun(p)}>
            <Plus size={16} /> Create a planned record
          </button>
          <small className="plan-note">
            Creates a notebook record with the current model and this proposal.
            No results are prefilled.
          </small>
        </article>
      </div>
    </>
  );
}
