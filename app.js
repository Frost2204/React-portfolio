const {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  createContext,
  useContext,
  useReducer,
} = React;

const CATEGORIES = [
  { id: "food", name: "Food", emoji: "\u{1F354}", color: "#E4572E" },
  {
    id: "groceries",
    name: "Groceries",
    emoji: "\u{1F6D2}",
    color: "#2E7D6B",
  },
  {
    id: "transport",
    name: "Transport",
    emoji: "\u{1F68C}",
    color: "#2F6FED",
  },
  {
    id: "shopping",
    name: "Shopping",
    emoji: "\u{1F6CD}",
    color: "#A64AC9",
  },
  { id: "bills", name: "Bills", emoji: "\u{1F9FE}", color: "#C8860D" },
  {
    id: "entertainment",
    name: "Entertainment",
    emoji: "\u{1F3AC}",
    color: "#D6416B",
  },
  { id: "health", name: "Health", emoji: "\u{1F48A}", color: "#1F9254" },
  {
    id: "subscriptions",
    name: "Subscriptions",
    emoji: "\u{1F501}",
    color: "#5B6EE1",
  },
  { id: "other", name: "Other", emoji: "\u2795", color: "#6B7280" },
];
const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
function catOf(id) {
  return CAT_MAP[id] || CAT_MAP.other;
}

const PAYMENT_METHODS = [
  { id: "upi", name: "GPay / UPI", emoji: "\u{1F4F1}" },
  { id: "cash", name: "Cash", emoji: "\u{1F4B5}" },
  { id: "debit", name: "Debit Card", emoji: "\u{1F4B3}" },
  { id: "credit", name: "Credit Card", emoji: "\u{1F4B3}" },
  { id: "bank", name: "Bank Transfer", emoji: "\u{1F3E6}" },
  { id: "other", name: "Other", emoji: "\u2795" },
];
const PM_MAP = Object.fromEntries(PAYMENT_METHODS.map((p) => [p.id, p]));
function pmOf(id) {
  return PM_MAP[id] || PM_MAP.other;
}

const CURRENCIES = {
  INR: "\u20B9",
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
};

let currentUid = null;
function setCurrentUid(u) {
  currentUid = u;
}
function userCol(store) {
  if (!currentUid) throw new Error("Not authenticated");
  return fbDb.collection("users").doc(currentUid).collection(store);
}
async function idbGetAll(store) {
  const snap = await userCol(store).get();
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}
async function idbGet(store, key) {
  const doc = await userCol(store).doc(key).get();
  if (!doc.exists) return undefined;
  return doc.data();
}
async function idbPut(store, value) {
  const key = value.id || value.key;
  if (!key) throw new Error("idbPut called without an id/key");
  await userCol(store).doc(key).set(value);
  return value;
}
async function idbDelete(store, key) {
  await userCol(store).doc(key).delete();
}
async function idbClear(store) {
  const snap = await userCol(store).get();
  const batch = fbDb.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

const DEFAULT_BUDGET = {
  dailyLimit: 500,
  weeklyLimit: 3500,
  monthlyLimit: 15000,
  warningThreshold: 70,
  warningEnabled: true,
};
const DEFAULT_SETTINGS = {
  currency: "INR",
  theme: "system",
  homeGraphPeriod: "daily",
};

function uid() {
  return (
    "e_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 9)
  );
}
function pad2(n) {
  return String(n).padStart(2, "0");
}
function toISODate(d) {
  return (
    d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate())
  );
}
function todayISO() {
  return toISODate(new Date());
}
function nowTimeStr() {
  const d = new Date();
  return pad2(d.getHours()) + ":" + pad2(d.getMinutes());
}
function parseISODate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function startOfWeek(d) {
  const r = new Date(d);
  const day = (r.getDay() + 6) % 7;
  r.setDate(r.getDate() - day);
  r.setHours(0, 0, 0, 0);
  return r;
}
function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function fmtDateLong(iso) {
  const d = parseISODate(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function fmtDateShort(iso) {
  const d = parseISODate(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}
function fmtTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return h12 + ":" + pad2(m) + " " + ap;
}
function weekdayName(iso, short) {
  const d = parseISODate(iso);
  return d.toLocaleDateString("en-IN", {
    weekday: short ? "short" : "long",
  });
}
function formatCurrency(amount, symbol, opts) {
  const n = Number(amount) || 0;
  const decimals =
    opts && opts.decimals != null ? opts.decimals : n % 1 === 0 ? 0 : 2;
  return (
    symbol +
    n.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}
function sumAmounts(list) {
  return list.reduce((s, e) => s + Number(e.amount || 0), 0);
}
function inRange(iso, startIso, endIso) {
  return iso >= startIso && iso <= endIso;
}
function filterByRange(expenses, startIso, endIso) {
  return expenses.filter((e) => inRange(e.date, startIso, endIso));
}
function groupBy(list, keyFn) {
  const out = {};
  for (const item of list) {
    const k = keyFn(item);
    if (!out[k]) out[k] = [];
    out[k].push(item);
  }
  return out;
}
function statusForPct(pct) {
  if (pct >= 100) return "danger";
  if (pct >= 90) return "warn";
  if (pct >= 70) return "warn";
  return "ok";
}
function statusColorVar(status) {
  if (status === "danger") return "var(--red)";
  if (status === "warn") return "var(--amber)";
  return "var(--green)";
}
function statusSoftVar(status) {
  if (status === "danger") return "var(--red-soft)";
  if (status === "warn") return "var(--amber-soft)";
  return "var(--green-soft)";
}
function clampPct(p) {
  return Math.max(0, Math.min(100, p));
}
function Icon({ name, size = 18, strokeWidth = 2 }) {
  const s = { width: size, height: size };
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const paths = {
    home: <path {...common} d="M4 11.5 12 4l8 7.5M6 10v9h12v-9" />,
    list: (
      <g {...common}>
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="14" y2="18" />
      </g>
    ),
    chart: (
      <g {...common}>
        <line x1="5" y1="20" x2="5" y2="11" />
        <line x1="12" y1="20" x2="12" y2="5" />
        <line x1="19" y1="20" x2="19" y2="14" />
      </g>
    ),
    calendar: (
      <g {...common}>
        <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" />
        <line x1="4" y1="10" x2="20" y2="10" />
        <line x1="8" y1="3" x2="8" y2="7.5" />
        <line x1="16" y1="3" x2="16" y2="7.5" />
      </g>
    ),
    wallet: (
      <g {...common}>
        <rect x="3.5" y="6.5" width="17" height="12" rx="2.5" />
        <path d="M15 12.2h3" />
      </g>
    ),
    file: (
      <g {...common}>
        <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5A1 1 0 0 1 7 3.5Z" />
        <path d="M14 3.5V8h4" />
      </g>
    ),
    settings: (
      <g {...common}>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 3.5v2.4M12 18.1v2.4M4.6 7.3l2.1 1.2M17.3 15.5l2.1 1.2M4.6 16.7l2.1-1.2M17.3 8.5l2.1-1.2M3.5 12h2.4M18.1 12h2.4" />
      </g>
    ),
    search: (
      <g {...common}>
        <circle cx="11" cy="11" r="6.5" />
        <line x1="20" y1="20" x2="15.8" y2="15.8" />
      </g>
    ),
    bell: (
      <g {...common}>
        <path d="M6 10.5a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14.5 6 10.5Z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </g>
    ),
    plus: (
      <g {...common}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </g>
    ),
    close: (
      <g {...common}>
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </g>
    ),
    edit: (
      <g {...common}>
        <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      </g>
    ),
    trash: (
      <g {...common}>
        <path d="M5 7h14M9 7V4.8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V7M7 7l1 12.2a1.5 1.5 0 0 0 1.5 1.3h5a1.5 1.5 0 0 0 1.5-1.3L17 7" />
      </g>
    ),
    copy: (
      <g {...common}>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15V5a1 1 0 0 1 1-1h10" />
      </g>
    ),
    chevronLeft: <polyline {...common} points="15 5 8 12 15 19" />,
    chevronRight: <polyline {...common} points="9 5 16 12 9 19" />,
    download: (
      <g {...common}>
        <path d="M12 3.5v12M8 12l4 4 4-4" />
        <path d="M5 19.5h14" />
      </g>
    ),
    upload: (
      <g {...common}>
        <path d="M12 20.5v-12M8 12l4-4 4 4" />
        <path d="M5 4.5h14" />
      </g>
    ),
    alert: (
      <g {...common}>
        <path d="M12 4 21 19.5H3Z" />
        <line x1="12" y1="10" x2="12" y2="14.5" />
        <circle cx="12" cy="17.3" r="0.1" fill="currentColor" stroke="none" />
      </g>
    ),
    check: (
      <g {...common}>
        <circle cx="12" cy="12" r="8.5" />
        <polyline points="8.3 12.4 11 15 15.7 9.5" />
      </g>
    ),
    filter: (
      <g {...common}>
        <path d="M4 5h16M7 12h10M10 19h4" />
      </g>
    ),
    sun: (
      <g {...common}>
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </g>
    ),
    moon: (
      <path
        {...common}
        d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
      />
    ),
    monitor: (
      <g {...common}>
        <rect x="3.5" y="4.5" width="17" height="12" rx="2" />
        <line x1="8" y1="20" x2="16" y2="20" />
        <line x1="12" y1="16.5" x2="12" y2="20" />
      </g>
    ),
    tag: (
      <g {...common}>
        <path d="m13.5 4 6.5 6.5a1.7 1.7 0 0 1 0 2.4L14 19a1.7 1.7 0 0 1-2.4 0L4.5 12.4V4h8Z" />
        <circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
      </g>
    ),
    arrowUp: (
      <g {...common}>
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="6 11 12 5 18 11" />
      </g>
    ),
    arrowDown: (
      <g {...common}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="6 13 12 19 18 13" />
      </g>
    ),
    logo: (
      <g {...common} strokeWidth="2.4">
        <path d="M6 12.5 10 16l8-9" />
      </g>
    ),
    dot: <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />,
  };
  return (
    <svg viewBox="0 0 24 24" style={s} aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
}

const ToastContext = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, type = "default") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toast-wrap" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={"toast " + (t.type !== "default" ? t.type : "")}
          >
            {t.type === "warn" && <Icon name="alert" size={15} />}
            {t.type === "ok" && <Icon name="check" size={15} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
function useToast() {
  return useContext(ToastContext);
}

function ConfirmContext(props) {
  return null;
}
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onMouseDown={onCancel}>
      <div
        className="modal"
        style={{ maxWidth: 380 }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-body">
          <div className="empty-state" style={{ padding: "8px 0 4px" }}>
            <div
              className="icon-wrap"
              style={{
                background: danger ? "var(--red-soft)" : "var(--accent-soft)",
                color: danger ? "var(--red)" : "var(--accent)",
              }}
            >
              <Icon name={danger ? "trash" : "alert"} size={26} />
            </div>
            <h3>{title}</h3>
            <p>{message}</p>
          </div>
        </div>
        <div className="modal-foot">
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={"btn " + (danger ? "btn-danger" : "btn-primary")}
            style={{ flex: 1 }}
            onClick={onConfirm}
          >
            {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

function useConfirm() {
  const [state, setState] = useState(null);
  const confirm = useCallback((opts) => {
    return new Promise((resolve) => {
      setState({ ...opts, resolve });
    });
  }, []);
  const node = state ? (
    <ConfirmDialog
      open={true}
      title={state.title}
      message={state.message}
      confirmLabel={state.confirmLabel}
      danger={state.danger}
      onConfirm={() => {
        state.resolve(true);
        setState(null);
      }}
      onCancel={() => {
        state.resolve(false);
        setState(null);
      }}
    />
  ) : null;
  return [confirm, node];
}

function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        style={wide ? { maxWidth: 680 } : undefined}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" size={17} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

function Gauge({ pct, status, size = 156, label, sub }) {
  const stroke = 13;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (c * clampPct(pct)) / 100;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={statusColorVar(status)}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c - dash}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .5s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: size * 0.19,
            fontWeight: 800,
            color: statusColorVar(status),
          }}
        >
          {Math.round(pct)}%
        </div>
        {label && (
          <div
            style={{
              fontSize: 11,
              color: "var(--text-2)",
              fontWeight: 700,
              marginTop: 2,
            }}
          >
            {label}
          </div>
        )}
        {sub && (
          <div style={{ fontSize: 10.5, color: "var(--text-3)" }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

function BarChart({ data, height = 180, budgetLine, symbol, formatX }) {
  const max = Math.max(1, ...data.map((d) => d.value), budgetLine || 0);
  const w = 100 / data.length;
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          height,
          gap: 4,
          position: "relative",
        }}
      >
        {budgetLine ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: (budgetLine / max) * (height - 22),
              borderTop: "2px dashed var(--text-3)",
              zIndex: 1,
            }}
          />
        ) : null}
        {data.map((d, i) => {
          const barH = Math.max(2, (d.value / max) * (height - 22));
          const over = budgetLine && d.value > budgetLine;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                height: "100%",
                minWidth: 0,
              }}
              title={d.label + ": " + formatCurrency(d.value, symbol || "")}
            >
              <div
                style={{
                  width: "70%",
                  maxWidth: 34,
                  height: barH,
                  borderRadius: "6px 6px 3px 3px",
                  background: over ? "var(--red)" : "var(--accent)",
                  transition: "height .4s ease",
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 10.5,
              color: "var(--text-3)",
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {formatX ? formatX(d) : d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ data, size = 170, symbol, thickness = 26 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  if (total <= 0) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `${thickness}px solid var(--border)`,
          boxSizing: "border-box",
        }}
      />
    );
  }
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = frac * c;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="mono" style={{ fontSize: 12, fontWeight: 800 }}>
          {formatCurrency(total, symbol || "", { decimals: 0 })}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--text-3)",
            fontWeight: 700,
          }}
        >
          TOTAL
        </div>
      </div>
    </div>
  );
}

function Legend({ data, symbol }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12.5,
          }}
        >
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: 3,
              background: d.color,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, fontWeight: 600 }}>{d.label}</div>
          <div className="mono text-muted">
            {formatCurrency(d.value, symbol || "", { decimals: 0 })}
          </div>
          <div
            className="text-faint mono"
            style={{ width: 38, textAlign: "right" }}
          >
            {Math.round((d.value / total) * 100)}%
          </div>
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ pct, status, height = 8 }) {
  return (
    <div className="progress-track" style={{ height }}>
      <div
        className="progress-fill"
        style={{
          width: clampPct(pct) + "%",
          background: statusColorVar(status),
        }}
      />
    </div>
  );
}

function CategoryBadge({ id, size = 36 }) {
  const c = catOf(id);
  return (
    <div
      className="cat-badge"
      style={{
        width: size,
        height: size,
        background: c.color + "22",
        color: c.color,
      }}
    >
      {c.emoji}
    </div>
  );
}

function StatusBadge({ status, children }) {
  return (
    <span
      className="badge"
      style={{
        background: statusSoftVar(status),
        color: statusColorVar(status),
      }}
    >
      {children}
    </span>
  );
}
const AuthContext = createContext(null);
function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = fbAuth.onAuthStateChanged((u) => {
      setUser(u);
      setCurrentUid(u ? u.uid : null);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const login = useCallback(async (email, password) => {
    await fbAuth.signInWithEmailAndPassword(email, password);
  }, []);

  const logout = useCallback(async () => {
    await fbAuth.signOut();
  }, []);

  const value = { user, authLoading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(
        err && err.message
          ? err.message
          : "Could not sign in. Check your email and password.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 16,
      }}
    >
      <div className="card card-pad" style={{ width: "100%", maxWidth: 360 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 22,
          }}
        >
          <div className="brand-mark">
            <Icon name="logo" size={17} />
          </div>
          <div className="brand-name">DailySpend</div>
        </div>
        <h2 style={{ fontSize: 18, marginBottom: 4 }}>Sign in</h2>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 18 }}>
          Use the account created for you to access your data.
        </p>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && (
            <div style={{ color: "var(--red)", fontSize: 12.5 }}>{error}</div>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={busy}
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

const DataContext = createContext(null);
function useData() {
  return useContext(DataContext);
}

function DataProvider({ children }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [merchants, setMerchants] = useState([]);
  const toast = useToast();
  const lastWarnRef = useRef({ date: null, level: 0 });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    (async () => {
      try {
        const [exp, b, s, m] = await Promise.all([
          idbGetAll("expenses"),
          idbGet("meta", "budget"),
          idbGet("meta", "settings"),
          idbGet("meta", "merchants"),
        ]);
        setExpenses(
          exp
            .sort((a, c) => (a.date + a.time).localeCompare(c.date + c.time))
            .reverse(),
        );
        const finalBudget = b ? { ...DEFAULT_BUDGET, ...b } : DEFAULT_BUDGET;
        const finalSettings = s
          ? { ...DEFAULT_SETTINGS, ...s }
          : DEFAULT_SETTINGS;
        setBudget(finalBudget);
        setSettings(finalSettings);
        setMerchants(m && Array.isArray(m.list) ? m.list : []);
        if (!b) await idbPut("meta", { key: "budget", ...DEFAULT_BUDGET });
        if (!s) await idbPut("meta", { key: "settings", ...DEFAULT_SETTINGS });
        if (!m) await idbPut("meta", { key: "merchants", list: [] });
      } catch (err) {
        console.error(err);
        toast && toast("Could not load saved data. Starting fresh.", "warn");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    const root = document.documentElement;
    function apply() {
      const t = settings.theme || "system";
      const dark =
        t === "dark" ||
        (t === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.setAttribute("data-theme", dark ? "dark" : "light");
    }
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if (settings.theme === "system") apply();
    };
    mq.addEventListener
      ? mq.addEventListener("change", listener)
      : mq.addListener(listener);
    return () => {
      mq.removeEventListener
        ? mq.removeEventListener("change", listener)
        : mq.removeListener(listener);
    };
  }, [settings.theme]);

  const symbol = CURRENCIES[settings.currency] || "\u20B9";

  const todaySpent = useMemo(
    () => sumAmounts(expenses.filter((e) => e.date === todayISO())),
    [expenses],
  );

  function maybeWarn(dateIso) {
    if (!budget.warningEnabled) return;
    if (dateIso !== todayISO()) return;
    const spent = sumAmounts(expenses.filter((e) => e.date === dateIso));
    const pct = budget.dailyLimit > 0 ? (spent / budget.dailyLimit) * 100 : 0;
    const threshold = budget.warningThreshold || 70;
    let level = 0;
    let msg = null;
    let type = "warn";
    if (pct >= 100) {
      level = 3;
      msg = `Daily budget exceeded by ${formatCurrency(spent - budget.dailyLimit, symbol)}.`;
      type = "danger";
    } else if (pct >= 90) {
      level = 2;
      msg = `You're at ${Math.round(pct)}% of today's budget.`;
    } else if (pct >= threshold) {
      level = 1;
      const remaining = Math.max(0, budget.dailyLimit - spent);
      msg = `Only ${formatCurrency(remaining, symbol)} remaining today.`;
    }
    if (
      level > 0 &&
      (lastWarnRef.current.date !== dateIso ||
        lastWarnRef.current.level < level)
    ) {
      lastWarnRef.current = { date: dateIso, level };
      if (toast && msg) toast(msg, type);
    }
  }

  const addMerchantPreset = useCallback(async (name) => {
    const clean = (name || "").trim();
    if (!clean) return;
    setMerchants((prev) => {
      if (prev.some((m) => m.toLowerCase() === clean.toLowerCase()))
        return prev;
      const next = [...prev, clean].sort((a, b) => a.localeCompare(b));
      idbPut("meta", { key: "merchants", list: next });
      return next;
    });
  }, []);

  const removeMerchantPreset = useCallback(async (name) => {
    setMerchants((prev) => {
      const next = prev.filter((m) => m !== name);
      idbPut("meta", { key: "merchants", list: next });
      return next;
    });
  }, []);

  const addExpense = useCallback(
    async (data) => {
      const now = new Date().toISOString();
      const record = {
        id: uid(),
        amount: Number(data.amount),
        category: data.category,
        merchant: data.merchant || "Untitled",
        date: data.date,
        time: data.time,
        paymentMethod: data.paymentMethod,
        note: data.note || "",
        tags: data.tags || [],
        createdAt: now,
        updatedAt: now,
      };
      await idbPut("expenses", record);
      setExpenses((prev) => {
        const next = [record, ...prev];
        setTimeout(() => maybeWarnWith(next, record.date), 0);
        return next;
      });
      addMerchantPreset(record.merchant);
      return record;
    },
    [budget, symbol, addMerchantPreset],
  );

  function maybeWarnWith(list, dateIso) {
    if (!budget.warningEnabled) return;
    if (dateIso !== todayISO()) return;
    const spent = sumAmounts(list.filter((e) => e.date === dateIso));
    const pct = budget.dailyLimit > 0 ? (spent / budget.dailyLimit) * 100 : 0;
    const threshold = budget.warningThreshold || 70;
    let level = 0,
      msg = null,
      type = "warn";
    if (pct >= 100) {
      level = 3;
      msg = `Daily budget exceeded by ${formatCurrency(spent - budget.dailyLimit, symbol)}.`;
      type = "danger";
    } else if (pct >= 90) {
      level = 2;
      msg = `You're at ${Math.round(pct)}% of today's budget.`;
    } else if (pct >= threshold) {
      level = 1;
      const remaining = Math.max(0, budget.dailyLimit - spent);
      msg = `Only ${formatCurrency(remaining, symbol)} remaining today.`;
    }
    if (
      level > 0 &&
      (lastWarnRef.current.date !== dateIso ||
        lastWarnRef.current.level < level)
    ) {
      lastWarnRef.current = { date: dateIso, level };
      if (toast && msg) toast(msg, type);
    }
  }

  const updateExpense = useCallback(
    async (id, data) => {
      const now = new Date().toISOString();
      setExpenses((prev) => {
        const idx = prev.findIndex((e) => e.id === id);
        if (idx === -1) return prev;
        const updated = {
          ...prev[idx],
          ...data,
          amount: Number(data.amount),
          updatedAt: now,
        };
        idbPut("expenses", updated);
        const next = [...prev];
        next[idx] = updated;
        setTimeout(() => maybeWarnWith(next, updated.date), 0);
        addMerchantPreset(updated.merchant);
        return next;
      });
    },
    [budget, symbol, addMerchantPreset],
  );

  const deleteExpense = useCallback(async (id) => {
    await idbDelete("expenses", id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const duplicateExpense = useCallback(async (id) => {
    setExpenses((prev) => {
      const orig = prev.find((e) => e.id === id);
      if (!orig) return prev;
      const now = new Date().toISOString();
      const copy = { ...orig, id: uid(), createdAt: now, updatedAt: now };
      idbPut("expenses", copy);
      return [copy, ...prev];
    });
  }, []);

  const saveBudget = useCallback(
    async (patch) => {
      const next = { ...budget, ...patch };
      try {
        await idbPut("meta", { key: "budget", ...next });
        setBudget(next);
      } catch (err) {
        console.error(err);
        toast && toast("Could not save budget. Try again.", "danger");
      }
    },
    [budget, toast],
  );

  const saveSettings = useCallback(
    async (patch) => {
      const next = { ...settings, ...patch };
      try {
        await idbPut("meta", { key: "settings", ...next });
        setSettings(next);
      } catch (err) {
        console.error(err);
        toast && toast("Could not save settings. Try again.", "danger");
      }
    },
    [settings, toast],
  );

  const clearAllData = useCallback(async () => {
    await idbClear("expenses");
    await idbPut("meta", { key: "budget", ...DEFAULT_BUDGET });
    await idbPut("meta", { key: "settings", ...settings });
    setExpenses([]);
    setBudget(DEFAULT_BUDGET);
  }, [settings]);

  const importData = useCallback(async (payload) => {
    if (!payload || !Array.isArray(payload.expenses))
      throw new Error("Invalid file");
    await idbClear("expenses");
    for (const e of payload.expenses) {
      if (!e.id) e.id = uid();
      await idbPut("expenses", e);
    }
    if (payload.budget) {
      await idbPut("meta", {
        ...DEFAULT_BUDGET,
        ...payload.budget,
        key: "budget",
      });
      setBudget({ ...DEFAULT_BUDGET, ...payload.budget });
    }
    if (payload.settings) {
      await idbPut("meta", {
        ...DEFAULT_SETTINGS,
        ...payload.settings,
        key: "settings",
      });
      setSettings({ ...DEFAULT_SETTINGS, ...payload.settings });
    }
    if (Array.isArray(payload.merchants)) {
      await idbPut("meta", { key: "merchants", list: payload.merchants });
      setMerchants(payload.merchants);
    }
    const exp = await idbGetAll("expenses");
    setExpenses(
      exp
        .sort((a, c) => (a.date + a.time).localeCompare(c.date + c.time))
        .reverse(),
    );
  }, []);

  const value = {
    loading,
    expenses,
    budget,
    settings,
    symbol,
    merchants,
    addExpense,
    updateExpense,
    deleteExpense,
    duplicateExpense,
    saveBudget,
    saveSettings,
    clearAllData,
    importData,
    addMerchantPreset,
    removeMerchantPreset,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
function AddExpenseModal({ onClose, editing, onEdited, presetDate }) {
  const {
    addExpense,
    updateExpense,
    budget,
    symbol,
    expenses,
    merchants,
    addMerchantPreset,
  } = useData();
  const toast = useToast();
  const blank = {
    amount: "",
    category: "food",
    merchant: "",
    date: presetDate || todayISO(),
    time: nowTimeStr(),
    paymentMethod: "upi",
    note: "",
    tags: "",
  };
  const [form, setForm] = useState(() =>
    editing
      ? {
          amount: String(editing.amount),
          category: editing.category,
          merchant: editing.merchant,
          date: editing.date,
          time: editing.time,
          paymentMethod: editing.paymentMethod,
          note: editing.note || "",
          tags: (editing.tags || []).join(", "),
        }
      : blank,
  );
  const [errors, setErrors] = useState({});
  const [merchantOpen, setMerchantOpen] = useState(false);
  const merchantBoxRef = useRef(null);
  const amountRef = useRef(null);
  useEffect(() => {
    amountRef.current && amountRef.current.focus();
  }, []);
  useEffect(() => {
    function onDocClick(e) {
      if (merchantBoxRef.current && !merchantBoxRef.current.contains(e.target))
        setMerchantOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  const merchantMatches = useMemo(() => {
    const q = form.merchant.trim().toLowerCase();
    const list = q
      ? merchants.filter((m) => m.toLowerCase().includes(q))
      : merchants;
    return list.slice(0, 6);
  }, [form.merchant, merchants]);
  const exactMatch = merchants.some(
    (m) => m.toLowerCase() === form.merchant.trim().toLowerCase(),
  );

  function validate() {
    const e = {};
    if (!form.amount || Number(form.amount) <= 0)
      e.amount = "Enter an amount greater than zero";
    if (!form.category) e.category = "Choose a category";
    if (!form.date) e.date = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(andAnother) {
    if (!validate()) return;
    const payload = {
      amount: Number(form.amount),
      category: form.category,
      merchant: form.merchant.trim() || "Untitled",
      date: form.date,
      time: form.time,
      paymentMethod: form.paymentMethod,
      note: form.note.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (editing) {
      await updateExpense(editing.id, payload);
      toast && toast("Expense updated", "ok");
      onEdited && onEdited();
      onClose();
    } else {
      await addExpense(payload);
      toast && toast("Expense saved", "ok");
      if (andAnother) {
        setForm({
          ...blank,
          category: form.category,
          paymentMethod: form.paymentMethod,
          date: form.date,
        });
        setErrors({});
        amountRef.current && amountRef.current.focus();
      } else {
        onClose();
      }
    }
  }

  const projectedTodaySpent = useMemo(() => {
    if (form.date !== todayISO()) return null;
    const others = expenses.filter(
      (e) => e.date === todayISO() && (!editing || e.id !== editing.id),
    );
    return sumAmounts(others) + (Number(form.amount) || 0);
  }, [form.amount, form.date, expenses, editing]);

  return (
    <Modal
      title={editing ? "Edit expense" : "Add expense"}
      onClose={onClose}
      footer={
        <React.Fragment>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            Cancel
          </button>
          {!editing && (
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => submit(true)}
            >
              Save &amp; add another
            </button>
          )}
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => submit(false)}
          >
            {editing ? "Save changes" : "Save expense"}
          </button>
        </React.Fragment>
      }
    >
      <div className="field">
        <label className="label" htmlFor="amt">
          Amount
        </label>
        <div className={"amount-input-wrap" + (errors.amount ? " error" : "")}>
          <span className="sym">{symbol}</span>
          <input
            id="amt"
            ref={amountRef}
            inputMode="decimal"
            placeholder="0"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value.replace(/[^0-9.]/g, ""),
              })
            }
            aria-invalid={!!errors.amount}
          />
        </div>
        {errors.amount && <div className="error-text">{errors.amount}</div>}
        {projectedTodaySpent != null && budget.dailyLimit > 0 && (
          <div className="text-faint" style={{ fontSize: 12, marginTop: 7 }}>
            This will bring today's spending to{" "}
            <span
              className="mono"
              style={{ fontWeight: 700, color: "var(--text-2)" }}
            >
              {formatCurrency(projectedTodaySpent, symbol)}
            </span>{" "}
            of your {formatCurrency(budget.dailyLimit, symbol)} daily budget.
          </div>
        )}
      </div>

      <div className="field">
        <label className="label">Category</label>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.id}
              className={"cat-pick" + (form.category === c.id ? " active" : "")}
              onClick={() => setForm({ ...form, category: c.id })}
            >
              <span className="em">{c.emoji}</span>
              <span className="nm">{c.name}</span>
            </button>
          ))}
        </div>
        {errors.category && <div className="error-text">{errors.category}</div>}
      </div>

      <div
        className="field"
        ref={merchantBoxRef}
        style={{ position: "relative" }}
      >
        <label className="label" htmlFor="merchant">
          Merchant / Place
        </label>
        <input
          id="merchant"
          className="input"
          placeholder="e.g. Blue Tokai Coffee, Zomato..."
          autoComplete="off"
          value={form.merchant}
          onChange={(e) => {
            setForm({ ...form, merchant: e.target.value });
            setMerchantOpen(true);
          }}
          onFocus={() => setMerchantOpen(true)}
        />
        {merchantOpen && merchantMatches.length > 0 && (
          <div
            className="card"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: 6,
              zIndex: 5,
              padding: 6,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {merchantMatches.map((m) => (
              <button
                type="button"
                key={m}
                className="btn-ghost"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 10px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                }}
                onClick={() => {
                  setForm({ ...form, merchant: m });
                  setMerchantOpen(false);
                }}
              >
                <Icon name="tag" size={13} />
                {m}
              </button>
            ))}
          </div>
        )}
        {form.merchant.trim() && !exactMatch && (
          <div className="text-faint" style={{ fontSize: 11.5, marginTop: 6 }}>
            "{form.merchant.trim()}" is new &mdash; it'll be saved as a
            quick-pick option for next time.
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div className="field" style={{ flex: 1 }}>
          <label className="label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="date"
            className={"input" + (errors.date ? " input-error" : "")}
            value={form.date}
            max={todayISO()}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          {errors.date && <div className="error-text">{errors.date}</div>}
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label className="label" htmlFor="time">
            Time
          </label>
          <input
            id="time"
            type="time"
            className="input"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Payment method</label>
        <div className="pm-grid">
          {PAYMENT_METHODS.map((p) => (
            <button
              type="button"
              key={p.id}
              className={
                "pm-pick" + (form.paymentMethod === p.id ? " active" : "")
              }
              onClick={() => setForm({ ...form, paymentMethod: p.id })}
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="note">
          Note (optional)
        </label>
        <textarea
          id="note"
          className="input"
          rows={2}
          placeholder="Add a note..."
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
      </div>

      <div className="field" style={{ marginBottom: 0 }}>
        <label className="label" htmlFor="tags">
          Tags (optional, comma separated)
        </label>
        <input
          id="tags"
          className="input"
          placeholder="e.g. work, friends"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
      </div>
    </Modal>
  );
}

function TransactionDetailModal({ expense, onClose, onEdit }) {
  const { deleteExpense, expenses, budget, symbol } = useData();
  const toast = useToast();
  const [confirm, confirmNode] = useConfirm();
  if (!expense) return null;
  const c = catOf(expense.category);
  const p = pmOf(expense.paymentMethod);
  const dayTotal = sumAmounts(expenses.filter((e) => e.date === expense.date));
  const dayRemaining = budget.dailyLimit - dayTotal;

  async function handleDelete() {
    const ok = await confirm({
      title: "Delete this expense?",
      message: `This will permanently remove ${formatCurrency(expense.amount, symbol)} at ${expense.merchant}.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (ok) {
      await deleteExpense(expense.id);
      toast && toast("Expense deleted", "ok");
      onClose();
    }
  }

  return (
    <Modal
      title="Transaction details"
      onClose={onClose}
      footer={
        <React.Fragment>
          <button className="btn btn-danger" onClick={handleDelete}>
            <Icon name="trash" size={15} />
            Delete
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => onEdit(expense)}
          >
            <Icon name="edit" size={15} />
            Edit transaction
          </button>
        </React.Fragment>
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <CategoryBadge id={expense.category} size={48} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>
            {expense.merchant}
          </div>
          <div className="text-muted" style={{ fontSize: 12.5 }}>
            {c.name}
          </div>
        </div>
        <div
          className="mono"
          style={{ marginLeft: "auto", fontSize: 22, fontWeight: 800 }}
        >
          {formatCurrency(expense.amount, symbol)}
        </div>
      </div>
      <div className="card" style={{ padding: 4 }}>
        <Row label="Date" value={fmtDateLong(expense.date)} />
        <Row label="Time" value={fmtTime(expense.time)} />
        <Row label="Payment" value={p.emoji + " " + p.name} />
        {expense.note && <Row label="Note" value={expense.note} />}
        {expense.tags && expense.tags.length > 0 && (
          <Row
            label="Tags"
            value={
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {expense.tags.map((t, i) => (
                  <span key={i} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            }
          />
        )}
      </div>
      <div className="divider" />
      <div className="section-title" style={{ fontSize: 13, marginBottom: 10 }}>
        Budget impact
      </div>
      <div
        className="card card-pad"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            className="text-faint"
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Spent that day
          </div>
          <div className="mono" style={{ fontWeight: 800, fontSize: 15 }}>
            {formatCurrency(dayTotal, symbol)}
          </div>
        </div>
        <div>
          <div
            className="text-faint"
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Daily budget
          </div>
          <div className="mono" style={{ fontWeight: 800, fontSize: 15 }}>
            {formatCurrency(budget.dailyLimit, symbol)}
          </div>
        </div>
        <div>
          <div
            className="text-faint"
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Remaining after
          </div>
          <div
            className="mono"
            style={{
              fontWeight: 800,
              fontSize: 15,
              color: dayRemaining < 0 ? "var(--red)" : "var(--text)",
            }}
          >
            {formatCurrency(dayRemaining, symbol)}
          </div>
        </div>
      </div>
      {confirmNode}
    </Modal>
  );
}
function Row({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 14,
        padding: "10px 12px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="text-muted" style={{ fontSize: 12.5, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, textAlign: "right" }}>
        {value}
      </div>
    </div>
  );
}

function DayTransactionsModal({ date, onClose, onSelect }) {
  const { expenses, budget, symbol } = useData();
  const list = expenses
    .filter((e) => e.date === date)
    .sort((a, b) => b.time.localeCompare(a.time));
  const total = sumAmounts(list);
  const pct = budget.dailyLimit > 0 ? (total / budget.dailyLimit) * 100 : 0;
  const status = statusForPct(pct);
  return (
    <Modal title={fmtDateLong(date)} onClose={onClose}>
      <div
        className="card card-pad"
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            className="text-faint"
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Spent / Budget
          </div>
          <div className="mono" style={{ fontWeight: 800, fontSize: 18 }}>
            {formatCurrency(total, symbol)}{" "}
            <span
              className="text-muted"
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              / {formatCurrency(budget.dailyLimit, symbol)}
            </span>
          </div>
        </div>
        <StatusBadge status={status}>{Math.round(pct)}% used</StatusBadge>
      </div>
      {list.length === 0 ? (
        <div
          className="text-muted"
          style={{ textAlign: "center", padding: "20px 0" }}
        >
          No expenses recorded on this day.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {list.map((e) => (
            <button
              key={e.id}
              className="card expense-row-card"
              style={{
                width: "100%",
                textAlign: "left",
                border: "1px solid var(--border)",
              }}
              onClick={() => onSelect(e)}
            >
              <CategoryBadge id={e.category} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.merchant}
                </div>
                <div className="text-faint" style={{ fontSize: 11.5 }}>
                  {fmtTime(e.time)} &middot; {pmOf(e.paymentMethod).name}
                </div>
              </div>
              <div className="mono" style={{ fontWeight: 800 }}>
                {formatCurrency(e.amount, symbol)}
              </div>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const HOME_GRAPH_LABELS = {
  daily: { period: "Daily", spent: "Spent today" },
  weekly: { period: "Weekly", spent: "Spent this week" },
  monthly: { period: "Monthly", spent: "Spent this month" },
};

function Dashboard({ navigate, onAdd, onOpenExpense }) {
  const { expenses, budget, symbol, settings } = useData();
  const today = todayISO();
  const todays = useMemo(
    () => expenses.filter((e) => e.date === today),
    [expenses, today],
  );
  const todaySpent = sumAmounts(todays);

  const weekStart = startOfWeek(new Date());
  const weekExpenses = useMemo(
    () => filterByRange(expenses, toISODate(weekStart), today),
    [expenses, today],
  );
  const monthStart = startOfMonth(new Date());
  const monthExpenses = useMemo(
    () => filterByRange(expenses, toISODate(monthStart), today),
    [expenses, today],
  );

  const homeGraphPeriod = settings.homeGraphPeriod || "daily";
  const cardSpent =
    homeGraphPeriod === "weekly"
      ? sumAmounts(weekExpenses)
      : homeGraphPeriod === "monthly"
        ? sumAmounts(monthExpenses)
        : todaySpent;
  const cardLimit =
    homeGraphPeriod === "weekly"
      ? budget.weeklyLimit
      : homeGraphPeriod === "monthly"
        ? budget.monthlyLimit
        : budget.dailyLimit;
  const remaining = cardLimit - cardSpent;
  const pct = cardLimit > 0 ? (cardSpent / cardLimit) * 100 : 0;
  const status = statusForPct(pct);
  const graphLabels =
    HOME_GRAPH_LABELS[homeGraphPeriod] || HOME_GRAPH_LABELS.daily;
  const daysElapsed = Math.max(
    1,
    Math.floor((new Date() - monthStart) / 86400000) + 1,
  );
  const avgDaily = sumAmounts(monthExpenses) / daysElapsed;

  const last7 = useMemo(() => {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(new Date(), -i);
      const iso = toISODate(d);
      out.push({
        label: weekdayName(iso, true),
        value: sumAmounts(expenses.filter((e) => e.date === iso)),
        iso,
      });
    }
    return out;
  }, [expenses]);

  const catTotals = useMemo(() => {
    const grouped = groupBy(monthExpenses, (e) => e.category);
    return CATEGORIES.map((c) => ({
      ...c,
      value: sumAmounts(grouped[c.id] || []),
    }))
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [monthExpenses]);
  const catTotalSum = sumAmounts(monthExpenses) || 1;

  const recentToday = [...todays]
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, 5);

  if (expenses.length === 0) {
    return (
      <div className="page">
        <TopBar onAdd={onAdd} navigate={navigate} warnCount={0} />
        <div className="card">
          <div className="empty-state">
            <div className="icon-wrap">
              <Icon name="wallet" size={30} />
            </div>
            <h3>Start tracking your spending</h3>
            <p>
              Add your first expense to see your daily budget, trends, and
              insights.
            </p>
            <button className="btn btn-primary" onClick={onAdd}>
              <Icon name="plus" size={16} />
              Add Expense
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <TopBar
        onAdd={onAdd}
        navigate={navigate}
        warnCount={homeGraphPeriod !== "off" && pct >= 70 ? 1 : 0}
      />

      {homeGraphPeriod !== "off" && (
        <div
          className="card card-pad"
          style={{
            marginBottom: 16,
            background:
              status === "danger"
                ? "var(--red-soft)"
                : status === "warn"
                  ? "var(--amber-soft)"
                  : "var(--card)",
            borderColor:
              status !== "ok" ? statusColorVar(status) + "55" : "var(--border)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Gauge
              pct={pct}
              status={status}
              label={`of ${graphLabels.period.toLowerCase()} budget`}
            />
            <div style={{ flex: 1, minWidth: 220 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 14,
                }}
              >
                <div>
                  <div
                    className="text-faint"
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {graphLabels.period} budget
                  </div>
                  <div
                    className="mono"
                    style={{ fontSize: 19, fontWeight: 800 }}
                  >
                    {formatCurrency(cardLimit, symbol)}
                  </div>
                </div>
                <div>
                  <div
                    className="text-faint"
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {graphLabels.spent}
                  </div>
                  <div
                    className="mono"
                    style={{ fontSize: 19, fontWeight: 800 }}
                  >
                    {formatCurrency(cardSpent, symbol)}
                  </div>
                </div>
                <div>
                  <div
                    className="text-faint"
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Remaining
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 19,
                      fontWeight: 800,
                      color: remaining < 0 ? "var(--red)" : "var(--text)",
                    }}
                  >
                    {formatCurrency(remaining, symbol)}
                  </div>
                </div>
              </div>
              <ProgressBar pct={pct} status={status} height={10} />
              {status !== "ok" && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: statusColorVar(status),
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Icon name="alert" size={14} />
                  {status === "danger"
                    ? `Exceeded by ${formatCurrency(cardSpent - cardLimit, symbol)}`
                    : pct >= 90
                      ? "Almost at your limit"
                      : `Approaching your ${graphLabels.period.toLowerCase()} limit`}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-stats" style={{ marginBottom: 20 }}>
        <StatCard
          label="Spent today"
          value={formatCurrency(todaySpent, symbol)}
        />
        <StatCard
          label="Spent this week"
          value={formatCurrency(sumAmounts(weekExpenses), symbol)}
        />
        <StatCard
          label="Spent this month"
          value={formatCurrency(sumAmounts(monthExpenses), symbol)}
        />
        <StatCard
          label="Avg daily spend"
          value={formatCurrency(avgDaily, symbol)}
        />
        <StatCard label="Transactions" value={String(expenses.length)} />
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: "1fr", marginBottom: 20 }}
      >
        <div className="card card-pad">
          <div className="section-head">
            <div className="section-title">Today's expenses</div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("expenses")}
            >
              View all
            </button>
          </div>
          {recentToday.length === 0 ? (
            <div className="text-muted" style={{ padding: "18px 4px" }}>
              No expenses recorded today yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentToday.map((e) => (
                <button
                  key={e.id}
                  className="expense-row-card"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    borderRadius: 12,
                    padding: 8,
                  }}
                  onClick={() => onOpenExpense(e)}
                >
                  <CategoryBadge id={e.category} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {e.merchant}
                    </div>
                    <div className="text-faint" style={{ fontSize: 11.5 }}>
                      {catOf(e.category).name} &middot; {fmtTime(e.time)}{" "}
                      &middot; {pmOf(e.paymentMethod).name}
                    </div>
                  </div>
                  <div className="mono" style={{ fontWeight: 800 }}>
                    {formatCurrency(e.amount, symbol)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: "1.3fr 1fr", marginBottom: 8 }}
      >
        <div className="card card-pad">
          <div className="section-head">
            <div className="section-title">Last 7 days vs budget</div>
          </div>
          <BarChart
            data={last7}
            budgetLine={budget.dailyLimit}
            symbol={symbol}
            height={160}
          />
        </div>
        <div className="card card-pad">
          <div className="section-head">
            <div className="section-title">Category breakdown</div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("analytics")}
            >
              View analytics
            </button>
          </div>
          {catTotals.length === 0 ? (
            <div className="text-muted">No spending this month yet.</div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {catTotals.slice(0, 5).map((c) => (
                <div key={c.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12.5,
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>
                      {c.emoji} {c.name}
                    </span>
                    <span className="mono text-muted">
                      {formatCurrency(c.value, symbol)} &middot;{" "}
                      {Math.round((c.value / catTotalSum) * 100)}%
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: 6 }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: (c.value / catTotalSum) * 100 + "%",
                        background: c.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card stat-card">
      <div className="label">{label}</div>
      <div className="value mono">{value}</div>
    </div>
  );
}

function TopBar({ onAdd, navigate, warnCount }) {
  return (
    <div className="topbar">
      <div>
        <div className="topbar-greeting">{greeting()}</div>
        <div className="topbar-date">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
      </div>
      <div className="topbar-actions">
        <button
          className="icon-btn"
          aria-label="Search expenses"
          onClick={() => navigate("expenses", { focusSearch: true })}
        >
          <Icon name="search" size={17} />
        </button>
        <button
          className="icon-btn"
          aria-label="Notifications"
          onClick={() => navigate("budget")}
        >
          <Icon name="bell" size={17} />
          {warnCount > 0 && <span className="dot" />}
        </button>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>
          <Icon name="plus" size={15} />
          Add Expense
        </button>
      </div>
    </div>
  );
}
function ExpensesScreen({ onOpenExpense, onEdit, focusSearch }) {
  const { expenses, symbol, duplicateExpense, deleteExpense } = useData();
  const toast = useToast();
  const [confirm, confirmNode] = useConfirm();
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [cat, setCat] = useState("all");
  const [pm, setPm] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const searchRef = useRef(null);
  const PAGE_SIZE = 20;

  useEffect(() => {
    if (focusSearch && searchRef.current) searchRef.current.focus();
  }, [focusSearch]);
  useEffect(() => {
    setPage(1);
  }, [q, from, to, cat, pm, sort]);

  const filtered = useMemo(() => {
    let list = expenses;
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.merchant.toLowerCase().includes(s) ||
          (e.note || "").toLowerCase().includes(s) ||
          (e.tags || []).some((t) => t.toLowerCase().includes(s)),
      );
    }
    if (from) list = list.filter((e) => e.date >= from);
    if (to) list = list.filter((e) => e.date <= to);
    if (cat !== "all") list = list.filter((e) => e.category === cat);
    if (pm !== "all") list = list.filter((e) => e.paymentMethod === pm);
    list = [...list];
    if (sort === "newest")
      list.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    if (sort === "oldest")
      list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    if (sort === "highest") list.sort((a, b) => b.amount - a.amount);
    if (sort === "lowest") list.sort((a, b) => a.amount - b.amount);
    return list;
  }, [expenses, q, from, to, cat, pm, sort]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const filteredTotal = sumAmounts(filtered);
  const allTotal = sumAmounts(expenses);

  async function handleDelete(e) {
    const ok = await confirm({
      title: "Delete this expense?",
      message: `Remove ${formatCurrency(e.amount, symbol)} at ${e.merchant}? This can't be undone.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (ok) {
      await deleteExpense(e.id);
      toast && toast("Expense deleted", "ok");
    }
  }
  async function handleDuplicate(e) {
    await duplicateExpense(e.id);
    toast && toast("Expense duplicated", "ok");
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h1 style={{ fontSize: 20 }}>Expenses</h1>
          <div className="topbar-date">
            {filtered.length} of {expenses.length} transactions
          </div>
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          <div style={{ flex: "1 1 200px", position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-3)",
              }}
            >
              <Icon name="search" size={15} />
            </span>
            <input
              ref={searchRef}
              className="input"
              style={{ paddingLeft: 34 }}
              placeholder="Search merchant, note, tag..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search expenses"
            />
          </div>
          <select
            className="select"
            style={{ width: "auto" }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort by"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest amount</option>
            <option value="lowest">Lowest amount</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            type="date"
            className="input"
            style={{ width: "auto" }}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            aria-label="From date"
          />
          <input
            type="date"
            className="input"
            style={{ width: "auto" }}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="To date"
          />
          <select
            className="select"
            style={{ width: "auto" }}
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
          <select
            className="select"
            style={{ width: "auto" }}
            value={pm}
            onChange={(e) => setPm(e.target.value)}
            aria-label="Filter by payment method"
          >
            <option value="all">All payment methods</option>
            {PAYMENT_METHODS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.emoji} {p.name}
              </option>
            ))}
          </select>
          {(q || from || to || cat !== "all" || pm !== "all") && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setQ("");
                setFrom("");
                setTo("");
                setCat("all");
                setPm("all");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <MiniStat
          label="Filtered total"
          value={formatCurrency(filteredTotal, symbol)}
        />
        <MiniStat label="Transactions" value={String(filtered.length)} />
        <MiniStat
          label="All-time total"
          value={formatCurrency(allTotal, symbol)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon-wrap">
              <Icon name="search" size={26} />
            </div>
            <h3>No expenses found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        </div>
      ) : (
        <React.Fragment>
          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Merchant</th>
                  <th>Category</th>
                  <th>Payment</th>
                  <th>Note</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((e) => (
                  <tr key={e.id}>
                    <td className="text-muted">{fmtDateShort(e.date)}</td>
                    <td>
                      <button
                        className="btn-ghost"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                        onClick={() => onOpenExpense(e)}
                      >
                        {e.merchant}
                      </button>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {catOf(e.category).emoji} {catOf(e.category).name}
                      </span>
                    </td>
                    <td className="text-muted">{pmOf(e.paymentMethod).name}</td>
                    <td
                      className="text-faint"
                      style={{
                        maxWidth: 160,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {e.note || "\u2014"}
                    </td>
                    <td
                      className="mono"
                      style={{ textAlign: "right", fontWeight: 800 }}
                    >
                      {formatCurrency(e.amount, symbol)}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: 4,
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          className="icon-btn"
                          style={{ width: 32, height: 32 }}
                          aria-label="Edit"
                          onClick={() => onEdit(e)}
                        >
                          <Icon name="edit" size={14} />
                        </button>
                        <button
                          className="icon-btn"
                          style={{ width: 32, height: 32 }}
                          aria-label="Duplicate"
                          onClick={() => handleDuplicate(e)}
                        >
                          <Icon name="copy" size={14} />
                        </button>
                        <button
                          className="icon-btn"
                          style={{ width: 32, height: 32 }}
                          aria-label="Delete"
                          onClick={() => handleDelete(e)}
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-list">
            {visible.map((e) => (
              <div key={e.id} className="card expense-row-card">
                <button
                  style={{
                    display: "contents",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => onOpenExpense(e)}
                >
                  <CategoryBadge id={e.category} />
                </button>
                <div
                  style={{ flex: 1, minWidth: 0 }}
                  onClick={() => onOpenExpense(e)}
                >
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>
                    {e.merchant}
                  </div>
                  <div className="text-faint" style={{ fontSize: 11.5 }}>
                    {fmtDateShort(e.date)} &middot; {fmtTime(e.time)} &middot;{" "}
                    {pmOf(e.paymentMethod).name}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontWeight: 800 }}>
                    {formatCurrency(e.amount, symbol)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 3,
                      marginTop: 4,
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      className="icon-btn"
                      style={{ width: 28, height: 28 }}
                      aria-label="Edit"
                      onClick={() => onEdit(e)}
                    >
                      <Icon name="edit" size={12} />
                    </button>
                    <button
                      className="icon-btn"
                      style={{ width: 28, height: 28 }}
                      aria-label="Duplicate"
                      onClick={() => handleDuplicate(e)}
                    >
                      <Icon name="copy" size={12} />
                    </button>
                    <button
                      className="icon-btn"
                      style={{ width: 28, height: 28 }}
                      aria-label="Delete"
                      onClick={() => handleDelete(e)}
                    >
                      <Icon name="trash" size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visible.length < filtered.length && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                className="btn btn-secondary"
                onClick={() => setPage((p) => p + 1)}
              >
                Load more ({filtered.length - visible.length} remaining)
              </button>
            </div>
          )}
        </React.Fragment>
      )}
      {confirmNode}
    </div>
  );
}
function MiniStat({ label, value }) {
  return (
    <div>
      <div
        className="text-faint"
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div className="mono" style={{ fontWeight: 800, fontSize: 15 }}>
        {value}
      </div>
    </div>
  );
}
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function MonthGrid({ year, month, dailyLimit, byDate, onDayClick, compact }) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const total = daysInMonth(year, month);
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  const today = todayISO();
  return (
    <div>
      <div className="month-grid" style={{ marginBottom: 6 }}>
        {DOW.map((d) => (
          <div key={d} className="dow">
            {d}
          </div>
        ))}
      </div>
      <div className="month-grid">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="day-cell empty" />;
          const iso = year + "-" + pad2(month + 1) + "-" + pad2(d);
          const spent = byDate[iso] || 0;
          const pct = dailyLimit > 0 ? (spent / dailyLimit) * 100 : 0;
          const status = spent > 0 ? statusForPct(pct) : null;
          const isToday = iso === today;
          return (
            <button
              key={i}
              className={"day-cell" + (isToday ? " today" : "")}
              style={{
                background: status ? statusSoftVar(status) : "var(--bg)",
                cursor: "pointer",
              }}
              onClick={() => onDayClick(iso)}
            >
              <span className="dnum">{d}</span>
              {spent > 0 && !compact && (
                <span
                  className="damt"
                  style={{ color: statusColorVar(status) }}
                >
                  {spent >= 1000
                    ? (spent / 1000).toFixed(1) + "k"
                    : Math.round(spent)}
                </span>
              )}
              {spent > 0 && compact && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: statusColorVar(status),
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CalendarScreen({ onDaySelect }) {
  const { expenses, budget, symbol } = useData();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const byDate = useMemo(() => {
    const out = {};
    for (const e of expenses) out[e.date] = (out[e.date] || 0) + e.amount;
    return out;
  }, [expenses]);
  const monthExpenses = useMemo(
    () =>
      filterByRange(
        expenses,
        `${cursor.y}-${pad2(cursor.m + 1)}-01`,
        `${cursor.y}-${pad2(cursor.m + 1)}-${pad2(daysInMonth(cursor.y, cursor.m))}`,
      ),
    [expenses, cursor],
  );

  function shift(delta) {
    let m = cursor.m + delta,
      y = cursor.y;
    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }
    setCursor({ y, m });
  }
  const monthName = new Date(cursor.y, cursor.m, 1).toLocaleDateString(
    "en-IN",
    { month: "long", year: "numeric" },
  );

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h1 style={{ fontSize: 20 }}>Calendar</h1>
          <div className="topbar-date">Daily spending vs. budget</div>
        </div>
      </div>
      <div className="card card-pad">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <button
            className="icon-btn"
            onClick={() => shift(-1)}
            aria-label="Previous month"
          >
            <Icon name="chevronLeft" size={17} />
          </button>
          <div className="section-title">{monthName}</div>
          <button
            className="icon-btn"
            onClick={() => shift(1)}
            aria-label="Next month"
          >
            <Icon name="chevronRight" size={17} />
          </button>
        </div>
        <MonthGrid
          year={cursor.y}
          month={cursor.m}
          dailyLimit={budget.dailyLimit}
          byDate={byDate}
          onDayClick={onDaySelect}
        />
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 18,
            flexWrap: "wrap",
          }}
        >
          <Legendish color="var(--green)" label="Under budget" />
          <Legendish color="var(--amber)" label="Near limit" />
          <Legendish color="var(--red)" label="Over budget" />
        </div>
      </div>
      <div className="grid grid-stats" style={{ marginTop: 16 }}>
        <StatCard
          label="Month total"
          value={formatCurrency(sumAmounts(monthExpenses), symbol)}
        />
        <StatCard
          label="Days with spend"
          value={String(new Set(monthExpenses.map((e) => e.date)).size)}
        />
        <StatCard
          label="Avg per active day"
          value={formatCurrency(
            sumAmounts(monthExpenses) /
              Math.max(1, new Set(monthExpenses.map((e) => e.date)).size),
            symbol,
          )}
        />
      </div>
    </div>
  );
}
function Legendish({ color, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        color: "var(--text-2)",
      }}
    >
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: 3,
          background: color,
        }}
      />
      {label}
    </div>
  );
}

function BudgetScreen() {
  const { budget, saveBudget, expenses, symbol } = useData();
  const toast = useToast();
  const [daily, setDaily] = useState(String(budget.dailyLimit));
  const [weekly, setWeekly] = useState(String(budget.weeklyLimit));
  const [monthly, setMonthly] = useState(String(budget.monthlyLimit));
  const [threshold, setThreshold] = useState(budget.warningThreshold);
  useEffect(() => {
    setDaily(String(budget.dailyLimit));
    setWeekly(String(budget.weeklyLimit));
    setMonthly(String(budget.monthlyLimit));
    setThreshold(budget.warningThreshold);
  }, [budget]);

  async function save() {
    await saveBudget({
      dailyLimit: Number(daily) || 0,
      weeklyLimit: Number(weekly) || 0,
      monthlyLimit: Number(monthly) || 0,
      warningThreshold: Number(threshold),
    });
    toast && toast("Budget updated", "ok");
  }

  const byDate = useMemo(() => {
    const out = {};
    for (const e of expenses) out[e.date] = (out[e.date] || 0) + e.amount;
    return out;
  }, [expenses]);

  const perf = useMemo(() => {
    const days = Object.keys(byDate);
    let under = 0,
      over = 0,
      best = null,
      worst = null;
    for (const d of days) {
      const v = byDate[d];
      if (v <= budget.dailyLimit) under++;
      else over++;
      if (best === null || v < byDate[best]) best = d;
      if (worst === null || v > byDate[worst]) worst = d;
    }
    const avg = days.length ? sumAmounts(expenses) / days.length : 0;
    return { under, over, best, worst, avg, activeDays: days.length };
  }, [byDate, expenses, budget.dailyLimit]);

  const now = new Date();

  const [chartView, setChartView] = useState("daily");

  const weeklyData = useMemo(() => {
    const weeks = [];
    const currentWeekStart = startOfWeek(now);
    for (let i = 7; i >= 0; i--) {
      const s = addDays(currentWeekStart, -7 * i);
      const e = addDays(s, 6);
      const startIso = toISODate(s),
        endIso = toISODate(e);
      const value = sumAmounts(filterByRange(expenses, startIso, endIso));
      weeks.push({ label: fmtDateShort(startIso), value });
    }
    return weeks;
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const s = startOfMonth(d),
        e = endOfMonth(d);
      const value = sumAmounts(
        filterByRange(expenses, toISODate(s), toISODate(e)),
      );
      months.push({
        label: d.toLocaleDateString("en-IN", { month: "short" }),
        value,
      });
    }
    return months;
  }, [expenses]);

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h1 style={{ fontSize: 20 }}>Budget</h1>
          <div className="topbar-date">Set and track your spending limits</div>
        </div>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: "1fr", marginBottom: 16 }}
      >
        <div className="card card-pad">
          <div className="section-title" style={{ marginBottom: 14 }}>
            Spending limits
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: 14,
            }}
          >
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label">Daily budget</label>
              <div
                className="amount-input-wrap"
                style={{ padding: "8px 12px" }}
              >
                <span className="sym" style={{ fontSize: 18 }}>
                  {symbol}
                </span>
                <input
                  style={{ fontSize: 18 }}
                  inputMode="decimal"
                  value={daily}
                  onChange={(e) =>
                    setDaily(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label">Weekly budget</label>
              <div
                className="amount-input-wrap"
                style={{ padding: "8px 12px" }}
              >
                <span className="sym" style={{ fontSize: 18 }}>
                  {symbol}
                </span>
                <input
                  style={{ fontSize: 18 }}
                  inputMode="decimal"
                  value={weekly}
                  onChange={(e) =>
                    setWeekly(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label">Monthly budget</label>
              <div
                className="amount-input-wrap"
                style={{ padding: "8px 12px" }}
              >
                <span className="sym" style={{ fontSize: 18 }}>
                  {symbol}
                </span>
                <input
                  style={{ fontSize: 18 }}
                  inputMode="decimal"
                  value={monthly}
                  onChange={(e) =>
                    setMonthly(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                />
              </div>
            </div>
          </div>
          <div className="field" style={{ marginTop: 16, marginBottom: 10 }}>
            <label className="label">Warning threshold</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[50, 70, 80, 90].map((t) => (
                <button
                  key={t}
                  className={
                    "tab-btn" + (Number(threshold) === t ? " active" : "")
                  }
                  onClick={() => setThreshold(t)}
                >
                  {t}%
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={save}>
            Save budget
          </button>
        </div>
      </div>

      <div className="grid grid-stats" style={{ marginBottom: 16 }}>
        <StatCard label="Days under budget" value={String(perf.under)} />
        <StatCard label="Days over budget" value={String(perf.over)} />
        <StatCard
          label="Avg daily spend"
          value={formatCurrency(perf.avg, symbol)}
        />
        <StatCard
          label="Best day"
          value={perf.best ? fmtDateShort(perf.best) : "\u2014"}
        />
        <StatCard
          label="Worst day"
          value={perf.worst ? fmtDateShort(perf.worst) : "\u2014"}
        />
      </div>

      <div className="card card-pad">
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div className="section-title" style={{ marginBottom: 0 }}>
            {chartView === "daily"
              ? now.toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })
              : chartView === "weekly"
                ? "Last 8 weeks"
                : "Last 6 months"}
          </div>
          <div className="tabs">
            {["daily", "weekly", "monthly"].map((t) => (
              <button
                key={t}
                className={"tab-btn" + (chartView === t ? " active" : "")}
                onClick={() => setChartView(t)}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {chartView === "daily" && (
          <MonthGrid
            year={now.getFullYear()}
            month={now.getMonth()}
            dailyLimit={budget.dailyLimit}
            byDate={byDate}
            onDayClick={() => {}}
            compact
          />
        )}
        {chartView === "weekly" && (
          <BarChart
            data={weeklyData}
            symbol={symbol}
            height={170}
            budgetLine={budget.weeklyLimit}
          />
        )}
        {chartView === "monthly" && (
          <BarChart
            data={monthlyData}
            symbol={symbol}
            height={170}
            budgetLine={budget.monthlyLimit}
          />
        )}
      </div>
    </div>
  );
}
const RANGE_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "month", label: "This month" },
  { id: "lastmonth", label: "Last month" },
  { id: "3m", label: "3 months" },
  { id: "6m", label: "6 months" },
  { id: "custom", label: "Custom" },
];

function resolveRange(id, custom) {
  const today = new Date();
  const todayIso = todayISO();
  if (id === "today") return { start: todayIso, end: todayIso };
  if (id === "7d")
    return { start: toISODate(addDays(today, -6)), end: todayIso };
  if (id === "30d")
    return { start: toISODate(addDays(today, -29)), end: todayIso };
  if (id === "month")
    return { start: toISODate(startOfMonth(today)), end: todayIso };
  if (id === "lastmonth") {
    const lm = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return {
      start: toISODate(startOfMonth(lm)),
      end: toISODate(endOfMonth(lm)),
    };
  }
  if (id === "3m")
    return { start: toISODate(addDays(today, -89)), end: todayIso };
  if (id === "6m")
    return { start: toISODate(addDays(today, -179)), end: todayIso };
  if (id === "custom")
    return { start: custom.from || todayIso, end: custom.to || todayIso };
  return { start: todayIso, end: todayIso };
}

function AnalyticsScreen() {
  const { expenses, symbol } = useData();
  const [range, setRange] = useState("30d");
  const [custom, setCustom] = useState({
    from: todayISO(),
    to: todayISO(),
  });
  const { start, end } = resolveRange(range, custom);
  const list = useMemo(
    () => filterByRange(expenses, start, end),
    [expenses, start, end],
  );
  const total = sumAmounts(list);
  const numDays = Math.max(
    1,
    Math.round((parseISODate(end) - parseISODate(start)) / 86400000) + 1,
  );
  const avgPerDay = total / numDays;
  const largest = list.reduce(
    (m, e) => (e.amount > (m ? m.amount : -1) ? e : m),
    null,
  );
  const avgTxn = list.length ? total / list.length : 0;

  const byDay = useMemo(() => {
    const out = [];
    const s = parseISODate(start),
      e = parseISODate(end);
    const dayCount = Math.round((e - s) / 86400000) + 1;
    const bucket = dayCount > 45 ? "week" : "day";
    if (bucket === "day") {
      for (let i = 0; i < dayCount; i++) {
        const d = addDays(s, i);
        const iso = toISODate(d);
        out.push({
          label: dayCount > 10 ? String(d.getDate()) : weekdayName(iso, true),
          value: sumAmounts(list.filter((x) => x.date === iso)),
        });
      }
    } else {
      let cur = new Date(s);
      let wi = 1;
      while (cur <= e) {
        const wEnd = addDays(cur, 6);
        const wEndClamped = wEnd > e ? e : wEnd;
        out.push({
          label: "W" + wi,
          value: sumAmounts(
            filterByRange(list, toISODate(cur), toISODate(wEndClamped)),
          ),
        });
        cur = addDays(cur, 7);
        wi++;
      }
    }
    return out;
  }, [list, start, end]);

  const catData = useMemo(() => {
    const grouped = groupBy(list, (e) => e.category);
    return CATEGORIES.map((c) => ({
      label: c.name,
      value: sumAmounts(grouped[c.id] || []),
      color: c.color,
    }))
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [list]);

  const monthlyData = useMemo(() => {
    const out = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const s = toISODate(startOfMonth(d)),
        e = toISODate(endOfMonth(d));
      out.push({
        label: d.toLocaleDateString("en-IN", { month: "short" }),
        value: sumAmounts(filterByRange(expenses, s, e)),
      });
    }
    return out;
  }, [expenses]);

  const pmData = useMemo(() => {
    const grouped = groupBy(list, (e) => e.paymentMethod);
    return PAYMENT_METHODS.map((p, i) => ({
      label: p.name,
      value: sumAmounts(grouped[p.id] || []),
      color: ["#146356", "#2F6FED", "#C8860D", "#A64AC9", "#D6416B", "#6B7280"][
        i % 6
      ],
    }))
      .filter((p) => p.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [list]);

  const weekdayData = useMemo(() => {
    const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const sums = [0, 0, 0, 0, 0, 0, 0];
    for (const e of list) {
      const idx = (parseISODate(e.date).getDay() + 6) % 7;
      sums[idx] += e.amount;
    }
    return names.map((n, i) => ({ label: n, value: sums[i] }));
  }, [list]);

  const topMerchants = useMemo(() => {
    const grouped = groupBy(list, (e) => e.merchant);
    return Object.keys(grouped)
      .map((m) => ({
        name: m,
        value: sumAmounts(grouped[m]),
        count: grouped[m].length,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [list]);

  const insights = useMemo(() => {
    const out = [];
    const thisMonth = new Date();
    const lastMonth = new Date(
      thisMonth.getFullYear(),
      thisMonth.getMonth() - 1,
      1,
    );
    const thisMonthTotal = sumAmounts(
      filterByRange(expenses, toISODate(startOfMonth(thisMonth)), todayISO()),
    );
    const lastMonthTotal = sumAmounts(
      filterByRange(
        expenses,
        toISODate(startOfMonth(lastMonth)),
        toISODate(endOfMonth(lastMonth)),
      ),
    );
    if (lastMonthTotal > 0) {
      const diff = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      out.push(
        `You've spent ${Math.abs(Math.round(diff))}% ${diff >= 0 ? "more" : "less"} this month than last month.`,
      );
    }
    if (catData.length)
      out.push(
        `${catData[0].label} is your highest spending category, at ${formatCurrency(catData[0].value, symbol)}.`,
      );
    if (list.length)
      out.push(
        `Your average daily spending in this period is ${formatCurrency(avgPerDay, symbol)}.`,
      );
    if (weekdayData.some((w) => w.value > 0)) {
      const top = [...weekdayData].sort((a, b) => b.value - a.value)[0];
      out.push(
        `Your highest spending day is ${top.label === "Mon" ? "Monday" : top.label === "Tue" ? "Tuesday" : top.label === "Wed" ? "Wednesday" : top.label === "Thu" ? "Thursday" : top.label === "Fri" ? "Friday" : top.label === "Sat" ? "Saturday" : "Sunday"}, averaging ${formatCurrency(top.value, symbol)} in this period.`,
      );
    }
    if (topMerchants.length)
      out.push(
        `You've spent the most at ${topMerchants[0].name}, totalling ${formatCurrency(topMerchants[0].value, symbol)} across ${topMerchants[0].count} visit${topMerchants[0].count > 1 ? "s" : ""}.`,
      );
    return out;
  }, [expenses, catData, avgPerDay, weekdayData, topMerchants, symbol, list]);

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h1 style={{ fontSize: 20 }}>Analytics</h1>
          <div className="topbar-date">
            Deep dive into your spending patterns
          </div>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 16 }}>
        {RANGE_OPTIONS.map((r) => (
          <button
            key={r.id}
            className={"tab-btn" + (range === r.id ? " active" : "")}
            onClick={() => setRange(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>
      {range === "custom" && (
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input
            type="date"
            className="input"
            style={{ width: "auto" }}
            value={custom.from}
            onChange={(e) => setCustom({ ...custom, from: e.target.value })}
          />
          <input
            type="date"
            className="input"
            style={{ width: "auto" }}
            value={custom.to}
            onChange={(e) => setCustom({ ...custom, to: e.target.value })}
          />
        </div>
      )}

      <div className="grid grid-stats" style={{ marginBottom: 20 }}>
        <StatCard
          label="Total spending"
          value={formatCurrency(total, symbol)}
        />
        <StatCard
          label="Avg per day"
          value={formatCurrency(avgPerDay, symbol)}
        />
        <StatCard
          label="Largest transaction"
          value={largest ? formatCurrency(largest.amount, symbol) : "\u2014"}
        />
        <StatCard label="Transactions" value={String(list.length)} />
        <StatCard
          label="Avg transaction"
          value={formatCurrency(avgTxn, symbol)}
        />
      </div>

      {list.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon-wrap">
              <Icon name="chart" size={26} />
            </div>
            <h3>No data for this period</h3>
            <p>Pick a different range or add some expenses to see analytics.</p>
          </div>
        </div>
      ) : (
        <React.Fragment>
          <div
            className="grid"
            style={{ gridTemplateColumns: "1fr", marginBottom: 16 }}
          >
            <div className="card card-pad">
              <div className="section-title" style={{ marginBottom: 14 }}>
                Spending over time
              </div>
              <BarChart data={byDay} symbol={symbol} height={170} />
            </div>
          </div>

          <div
            className="grid"
            style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}
          >
            <div className="card card-pad">
              <div className="section-title" style={{ marginBottom: 14 }}>
                Category spending
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <DonutChart data={catData} symbol={symbol} size={148} />
                <div style={{ flex: 1, minWidth: 160 }}>
                  <Legend data={catData} symbol={symbol} />
                </div>
              </div>
            </div>
            <div className="card card-pad">
              <div className="section-title" style={{ marginBottom: 14 }}>
                Payment method breakdown
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <DonutChart data={pmData} symbol={symbol} size={148} />
                <div style={{ flex: 1, minWidth: 160 }}>
                  <Legend data={pmData} symbol={symbol} />
                </div>
              </div>
            </div>
          </div>

          <div
            className="grid"
            style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}
          >
            <div className="card card-pad">
              <div className="section-title" style={{ marginBottom: 14 }}>
                Monthly spending
              </div>
              <BarChart data={monthlyData} symbol={symbol} height={150} />
            </div>
            <div className="card card-pad">
              <div className="section-title" style={{ marginBottom: 14 }}>
                Spending by weekday
              </div>
              <BarChart data={weekdayData} symbol={symbol} height={150} />
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="card card-pad">
              <div className="section-title" style={{ marginBottom: 14 }}>
                Top merchants
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {topMerchants.map((m, i) => (
                  <div
                    key={m.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      className="mono"
                      style={{
                        width: 20,
                        fontWeight: 800,
                        color: "var(--text-3)",
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, fontWeight: 700, fontSize: 13 }}>
                      {m.name}
                    </div>
                    <div className="text-faint" style={{ fontSize: 11.5 }}>
                      {m.count} txn
                    </div>
                    <div className="mono" style={{ fontWeight: 800 }}>
                      {formatCurrency(m.value, symbol)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card card-pad">
              <div className="section-title" style={{ marginBottom: 6 }}>
                Insights
              </div>
              <div>
                {insights.map((ins, i) => (
                  <div key={i} className="insight-row">
                    <span className="insight-dot" />
                    <span style={{ fontSize: 13 }}>{ins}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function expensesToCSV(list) {
  const headers = [
    "Date",
    "Time",
    "Merchant",
    "Category",
    "Payment Method",
    "Amount",
    "Note",
    "Tags",
  ];
  const rows = list.map((e) => [
    e.date,
    e.time,
    e.merchant,
    catOf(e.category).name,
    pmOf(e.paymentMethod).name,
    e.amount,
    (e.note || "").replace(/[\r\n,]/g, " "),
    (e.tags || []).join(" | "),
  ]);
  const esc = (v) => {
    const s = String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  return [headers, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
}

function ReportsScreen() {
  const { expenses, budget, symbol } = useData();
  const [type, setType] = useState("monthly");
  const [anchor, setAnchor] = useState(todayISO());

  const range = useMemo(() => {
    const d = parseISODate(anchor);
    if (type === "daily")
      return {
        start: anchor,
        end: anchor,
        budgetForRange: budget.dailyLimit,
        label: fmtDateLong(anchor),
      };
    if (type === "weekly") {
      const s = startOfWeek(d);
      const e = addDays(s, 6);
      return {
        start: toISODate(s),
        end: toISODate(e),
        budgetForRange: budget.weeklyLimit,
        label: `Week of ${fmtDateShort(toISODate(s))}`,
      };
    }
    const s = startOfMonth(d),
      e = endOfMonth(d);
    return {
      start: toISODate(s),
      end: toISODate(e),
      budgetForRange: budget.monthlyLimit,
      label: d.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      }),
    };
  }, [type, anchor, budget]);

  const list = useMemo(
    () => filterByRange(expenses, range.start, range.end),
    [expenses, range],
  );
  const total = sumAmounts(list);
  const remaining = range.budgetForRange - total;
  const catData = useMemo(() => {
    const grouped = groupBy(list, (e) => e.category);
    return CATEGORIES.map((c) => ({
      ...c,
      value: sumAmounts(grouped[c.id] || []),
    }))
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [list]);
  const largest = useMemo(
    () => [...list].sort((a, b) => b.amount - a.amount).slice(0, 5),
    [list],
  );
  const trend = useMemo(() => {
    const s = parseISODate(range.start),
      e = parseISODate(range.end);
    const days = Math.round((e - s) / 86400000) + 1;
    const out = [];
    for (let i = 0; i < Math.min(days, 31); i++) {
      const iso = toISODate(addDays(s, i));
      out.push({
        label: String(addDays(s, i).getDate()),
        value: sumAmounts(list.filter((x) => x.date === iso)),
      });
    }
    return out;
  }, [list, range]);

  function exportCSV() {
    downloadBlob(
      expensesToCSV(list),
      `dailyspend-${type}-${range.start}.csv`,
      "text/csv",
    );
  }
  function exportJSON() {
    downloadBlob(
      JSON.stringify(
        {
          report: type,
          range,
          total,
          budget: range.budgetForRange,
          expenses: list,
        },
        null,
        2,
      ),
      `dailyspend-${type}-${range.start}.json`,
      "application/json",
    );
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h1 style={{ fontSize: 20 }}>Reports</h1>
          <div className="topbar-date">{range.label}</div>
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="tabs">
            {["daily", "weekly", "monthly"].map((t) => (
              <button
                key={t}
                className={"tab-btn" + (type === t ? " active" : "")}
                onClick={() => setType(t)}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <input
            type="date"
            className="input"
            style={{ width: "auto" }}
            value={anchor}
            onChange={(e) => setAnchor(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-stats" style={{ marginBottom: 16 }}>
        <StatCard
          label="Total spending"
          value={formatCurrency(total, symbol)}
        />
        <StatCard
          label="Budget"
          value={formatCurrency(range.budgetForRange, symbol)}
        />
        <StatCard label="Remaining" value={formatCurrency(remaining, symbol)} />
        <StatCard label="Transactions" value={String(list.length)} />
      </div>

      {list.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon-wrap">
              <Icon name="file" size={26} />
            </div>
            <h3>Nothing to report</h3>
            <p>No expenses were recorded in this period.</p>
          </div>
        </div>
      ) : (
        <React.Fragment>
          <div
            className="grid"
            style={{ gridTemplateColumns: "1fr", marginBottom: 16 }}
          >
            <div className="card card-pad">
              <div className="section-title" style={{ marginBottom: 14 }}>
                Spending trend
              </div>
              <BarChart data={trend} symbol={symbol} height={140} />
            </div>
          </div>
          <div
            className="grid"
            style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}
          >
            <div className="card card-pad">
              <div className="section-title" style={{ marginBottom: 14 }}>
                Category breakdown
              </div>
              <Legend
                data={catData.map((c) => ({
                  label: c.name,
                  value: c.value,
                  color: c.color,
                }))}
                symbol={symbol}
              />
            </div>
            <div className="card card-pad">
              <div className="section-title" style={{ marginBottom: 14 }}>
                Largest expenses
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {largest.map((e) => (
                  <div
                    key={e.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <CategoryBadge id={e.category} size={30} />
                    <div style={{ flex: 1, fontWeight: 700, fontSize: 13 }}>
                      {e.merchant}
                    </div>
                    <div className="mono" style={{ fontWeight: 800 }}>
                      {formatCurrency(e.amount, symbol)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}

      <div
        className="card card-pad"
        style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
      >
        <button className="btn btn-secondary" onClick={exportCSV}>
          <Icon name="download" size={15} />
          Export CSV
        </button>
        <button className="btn btn-secondary" onClick={exportJSON}>
          <Icon name="download" size={15} />
          Export JSON
        </button>
      </div>
    </div>
  );
}
function SettingsScreen({ navigate }) {
  const {
    settings,
    saveSettings,
    budget,
    saveBudget,
    expenses,
    clearAllData,
    importData,
    merchants,
    addMerchantPreset,
    removeMerchantPreset,
  } = useData();
  const { user, logout } = useAuth();
  const toast = useToast();
  const [confirm, confirmNode] = useConfirm();
  const fileRef = useRef(null);
  const [warningEnabled, setWarningEnabled] = useState(budget.warningEnabled);
  const [newMerchant, setNewMerchant] = useState("");
  useEffect(
    () => setWarningEnabled(budget.warningEnabled),
    [budget.warningEnabled],
  );

  function addPreset() {
    const clean = newMerchant.trim();
    if (!clean) return;
    addMerchantPreset(clean);
    setNewMerchant("");
    toast && toast("Merchant added to quick-picks", "ok");
  }

  async function toggleWarnings() {
    const next = !warningEnabled;
    setWarningEnabled(next);
    await saveBudget({ warningEnabled: next });
  }

  function exportAll() {
    const payload = {
      exportedAt: new Date().toISOString(),
      expenses,
      budget,
      settings,
    };
    downloadBlob(
      JSON.stringify(payload, null, 2),
      `dailyspend-backup-${todayISO()}.json`,
      "application/json",
    );
    toast && toast("Data exported", "ok");
  }

  function onImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const payload = JSON.parse(reader.result);
        const ok = await confirm({
          title: "Import data?",
          message:
            "This will replace all current expenses with the contents of this file.",
          confirmLabel: "Import",
        });
        if (ok) {
          await importData(payload);
          toast && toast("Data imported successfully", "ok");
        }
      } catch (err) {
        toast &&
          toast(
            "That file couldn't be read. Please check the format.",
            "danger",
          );
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  async function handleClear() {
    const ok = await confirm({
      title: "Clear all data?",
      message:
        "This permanently deletes every expense you've recorded. This cannot be undone.",
      confirmLabel: "Clear everything",
      danger: true,
    });
    if (ok) {
      await clearAllData();
      toast && toast("All data cleared", "ok");
    }
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h1 style={{ fontSize: 20 }}>Settings</h1>
          <div className="topbar-date">Manage your preferences and data</div>
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>
          Currency
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.keys(CURRENCIES).map((c) => (
            <button
              key={c}
              className={"tab-btn" + (settings.currency === c ? " active" : "")}
              onClick={() => saveSettings({ currency: c })}
            >
              {CURRENCIES[c]} {c}
            </button>
          ))}
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>
          Account
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div
            className="text-muted"
            style={{ fontSize: 13, wordBreak: "break-all" }}
          >
            {user && user.email}
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div className="section-head">
          <div className="section-title">Budget settings</div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate("budget")}
          >
            Open budget screen
          </button>
        </div>
        <div className="text-muted" style={{ fontSize: 13 }}>
          Daily{" "}
          {formatCurrency(budget.dailyLimit, CURRENCIES[settings.currency])}{" "}
          &middot; Weekly{" "}
          {formatCurrency(budget.weeklyLimit, CURRENCIES[settings.currency])}{" "}
          &middot; Monthly{" "}
          {formatCurrency(budget.monthlyLimit, CURRENCIES[settings.currency])}
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>
          Home graph
        </div>
        <div
          className="text-muted"
          style={{ fontSize: 12.5, marginBottom: 12 }}
        >
          Choose what the main budget graph on your Home screen tracks, or turn
          it off.
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["daily", "weekly", "monthly", "off"].map((t) => (
            <button
              key={t}
              className={
                "tab-btn" +
                ((settings.homeGraphPeriod || "daily") === t ? " active" : "")
              }
              onClick={() => saveSettings({ homeGraphPeriod: t })}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div className="section-head">
          <div className="section-title">Warning settings</div>
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>
            Show budget warnings
          </span>
          <input
            type="checkbox"
            checked={warningEnabled}
            onChange={toggleWarnings}
            style={{ width: 18, height: 18 }}
          />
        </label>
        <div className="text-faint" style={{ fontSize: 12, marginTop: 6 }}>
          Warns at {budget.warningThreshold}%, 90%, and when your daily budget
          is exceeded. Never blocks adding an expense.
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>
          Appearance
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={
              "tab-btn" + (settings.theme === "light" ? " active" : "")
            }
            onClick={() => saveSettings({ theme: "light" })}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Icon name="sun" size={14} />
            Light
          </button>
          <button
            className={"tab-btn" + (settings.theme === "dark" ? " active" : "")}
            onClick={() => saveSettings({ theme: "dark" })}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Icon name="moon" size={14} />
            Dark
          </button>
          <button
            className={
              "tab-btn" + (settings.theme === "system" ? " active" : "")
            }
            onClick={() => saveSettings({ theme: "system" })}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Icon name="monitor" size={14} />
            System
          </button>
        </div>
      </div>

      <div className="card card-pad">
        <div className="section-title" style={{ marginBottom: 12 }}>
          Data
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-secondary" onClick={exportAll}>
            <Icon name="download" size={15} />
            Export all data
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => fileRef.current.click()}
          >
            <Icon name="upload" size={15} />
            Import data
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={onImportFile}
          />
          <button className="btn btn-danger" onClick={handleClear}>
            <Icon name="trash" size={15} />
            Clear all data
          </button>
        </div>
      </div>
      {confirmNode}
    </div>
  );
}
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "expenses", label: "Expenses", icon: "list" },
  { id: "analytics", label: "Analytics", icon: "chart" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
  { id: "budget", label: "Budget", icon: "wallet" },
  { id: "reports", label: "Reports", icon: "file" },
  { id: "settings", label: "Settings", icon: "settings" },
];
const MOBILE_NAV_ITEMS = [
  { id: "dashboard", label: "Home", icon: "home" },
  { id: "expenses", label: "Expenses", icon: "list" },
  { id: "analytics", label: "Analytics", icon: "chart" },
  { id: "budget", label: "Budget", icon: "wallet" },
];

function Sidebar({ screen, navigate, onAdd }) {
  const { budget, expenses, symbol, settings } = useData();
  const today = todayISO();
  const homeGraphPeriod = settings.homeGraphPeriod || "daily";
  const todaySpent = sumAmounts(expenses.filter((e) => e.date === today));
  const weekSpent = sumAmounts(
    filterByRange(expenses, toISODate(startOfWeek(new Date())), today),
  );
  const monthSpent = sumAmounts(
    filterByRange(expenses, toISODate(startOfMonth(new Date())), today),
  );
  const miniSpent =
    homeGraphPeriod === "weekly"
      ? weekSpent
      : homeGraphPeriod === "monthly"
        ? monthSpent
        : todaySpent;
  const miniLimit =
    homeGraphPeriod === "weekly"
      ? budget.weeklyLimit
      : homeGraphPeriod === "monthly"
        ? budget.monthlyLimit
        : budget.dailyLimit;
  const pct = miniLimit > 0 ? (miniSpent / miniLimit) * 100 : 0;
  const status = statusForPct(pct);
  const miniLabel = (
    HOME_GRAPH_LABELS[homeGraphPeriod] || HOME_GRAPH_LABELS.daily
  ).period;
  return (
    <div className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Icon name="logo" size={17} />
        </div>
        <div className="brand-name">DailySpend</div>
      </div>
      <nav aria-label="Primary">
        {NAV_ITEMS.map((n) => (
          <button
            key={n.id}
            className={"nav-link" + (screen === n.id ? " active" : "")}
            onClick={() => navigate(n.id)}
            aria-current={screen === n.id ? "page" : undefined}
          >
            <Icon name={n.icon} size={17} />
            {n.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        {homeGraphPeriod !== "off" && (
          <div className="sidebar-budget-mini">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-2)",
                textTransform: "uppercase",
                marginBottom: 7,
              }}
            >
              <span>{miniLabel}</span>
              <span style={{ color: statusColorVar(status) }}>
                {Math.round(pct)}%
              </span>
            </div>
            <ProgressBar pct={pct} status={status} height={6} />
            <div
              className="mono text-faint"
              style={{ fontSize: 11, marginTop: 7 }}
            >
              {formatCurrency(miniSpent, symbol)} of{" "}
              {formatCurrency(miniLimit, symbol)}
            </div>
          </div>
        )}
        <button className="btn btn-primary btn-block" onClick={onAdd}>
          <Icon name="plus" size={15} />
          Quick Add
        </button>
      </div>
    </div>
  );
}

function BottomNav({ screen, navigate }) {
  return (
    <div className="bottom-nav" aria-label="Primary">
      {MOBILE_NAV_ITEMS.map((n) => (
        <button
          key={n.id}
          className={"bn-link" + (screen === n.id ? " active" : "")}
          onClick={() => navigate(n.id)}
          aria-current={screen === n.id ? "page" : undefined}
        >
          <Icon name={n.icon} size={19} />
          {n.label}
        </button>
      ))}
    </div>
  );
}

function AppShell() {
  const { loading } = useData();
  const [screen, setScreen] = useState("dashboard");
  const [navFlags, setNavFlags] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [detailExpense, setDetailExpense] = useState(null);
  const [dayModal, setDayModal] = useState(null);

  function navigate(target, flags) {
    setScreen(target);
    setNavFlags(flags || {});
    window.scrollTo({
      top: 0,
      behavior: "instant" in window ? "instant" : "auto",
    });
  }

  function openAdd() {
    setEditingExpense(null);
    setShowAdd(true);
  }
  function openEdit(e) {
    setDetailExpense(null);
    setDayModal(null);
    setEditingExpense(e);
    setShowAdd(true);
  }
  function openDetail(e) {
    setDetailExpense(e);
  }

  if (loading) {
    return (
      <div
        className="page"
        style={{ maxWidth: 1180, margin: "0 auto", paddingTop: 40 }}
      >
        <div
          className="skeleton"
          style={{ height: 40, width: 220, marginBottom: 20 }}
        />
        <div
          className="skeleton"
          style={{ height: 160, marginBottom: 20, borderRadius: 14 }}
        />
        <div className="grid grid-stats">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 76, borderRadius: 14 }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar screen={screen} navigate={navigate} onAdd={openAdd} />
      <div className="main">
        {screen === "dashboard" && (
          <Dashboard
            navigate={navigate}
            onAdd={openAdd}
            onOpenExpense={openDetail}
          />
        )}
        {screen === "expenses" && (
          <ExpensesScreen
            onOpenExpense={openDetail}
            onEdit={openEdit}
            focusSearch={navFlags.focusSearch}
          />
        )}
        {screen === "analytics" && <AnalyticsScreen />}
        {screen === "calendar" && (
          <CalendarScreen onDaySelect={(d) => setDayModal(d)} />
        )}
        {screen === "budget" && <BudgetScreen />}
        {screen === "reports" && <ReportsScreen />}
        {screen === "settings" && <SettingsScreen navigate={navigate} />}
      </div>
      <BottomNav screen={screen} navigate={navigate} />
      <button className="fab" aria-label="Add expense" onClick={openAdd}>
        <Icon name="plus" size={24} />
      </button>

      {showAdd && (
        <AddExpenseModal
          editing={editingExpense}
          presetDate={dayModal || todayISO()}
          onClose={() => setShowAdd(false)}
        />
      )}
      {detailExpense && (
        <TransactionDetailModal
          expense={detailExpense}
          onClose={() => setDetailExpense(null)}
          onEdit={openEdit}
        />
      )}
      {dayModal && !showAdd && (
        <DayTransactionsModal
          date={dayModal}
          onClose={() => setDayModal(null)}
          onSelect={(e) => {
            setDayModal(null);
            openDetail(e);
          }}
        />
      )}
    </div>
  );
}

function Gate() {
  const { user, authLoading } = useAuth();
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></div>
    );
  }
  if (!user) return <LoginScreen />;
  return (
    <DataProvider>
      <AppShell />
    </DataProvider>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </ToastProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
