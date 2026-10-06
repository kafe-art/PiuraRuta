import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  Download,
  GripVertical,
  Heart,
  LocateFixed,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  Navigation,
  Plus,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Trash2,
  UserRound,
  Utensils,
  WifiOff,
  X,
  Bell,
  ChevronLeft,
  LogOut,
  Settings,
  Sun,
  Type,
} from "lucide-react"

type Screen = "mapa" | "ruta" | "gustos" | "perfil" | "ajustes"
type Place = (typeof PINS)[number]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Ctx = createContext<any>(null)
const useApp = () => useContext(Ctx)
const IMG = {
  food: "https://images.unsplash.com/photo-1533658266890-8bd362930725?auto=format&fit=crop&w=1000&q=85",
  market:
    "https://images.unsplash.com/photo-1651509245581-b92aec498cfe?auto=format&fit=crop&w=1000&q=85",
}

function Button({
  children,
  kind = "primary",
  className = "",
  onClick,
  disabled,
  label,
}: {
  children: ReactNode
  kind?: "primary" | "secondary" | "ghost" | "icon"
  className?: string
  onClick?: () => void
  disabled?: boolean
  label?: string
}) {
  return (
    <button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`btn btn--${kind} ${className}`}
    >
      {children}
    </button>
  )
}

export function Chip({
  children,
  active,
  onClick,
}: {
  children: ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      className={`chip ${active ? "active" : ""}`}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className={`logo ${small ? "small" : ""}`}>
      <span className="logo-mark">
        <MapPin />
      </span>
      <strong>
        Piura<span>Ruta</span>
      </strong>
    </div>
  )
}

export function Stepper({ step }: { step: number }) {
  return (
    <div className="stepper">
      <div>
        <span>Paso {step} de 4</span>
        <span>{step * 25}%</span>
      </div>
      <i>
        <b style={{ width: `${step * 25}%` }} />
      </i>
    </div>
  )
}

export function Toast({ text }: { text: string }) {
  return (
    <div className="toast" role="status">
      <Check size={17} />
      {text}
    </div>
  )
}

export function Skeleton() {
  return (
    <div className="skeleton-card" aria-label="Cargando">
      <i />
      <b />
      <span />
    </div>
  )
}

function Splash({ done }: { done: () => void }) {
  useEffect(() => {
    const id = setTimeout(done, 2000)
    return () => clearTimeout(id)
  }, [done])
  return (
    <main className="splash">
      <Logo />
      <p>Sabores, historias y manos de Piura.</p>
      <i />
    </main>
  )
}

function Access({ enter }: { enter: (google: boolean) => void }) {
  return (
    <main className="access">
      <div className="access-photo">
        <img src={IMG.market} alt="Mercado tradicional con frutas frescas" />
        <div>
          <Logo small />
          <section>
            <em>Tu guía local</em>
            <h1>Descubre el Piura que se comparte.</h1>
          </section>
        </div>
      </div>
      <section className="access-body">
        <h2>Empieza tu ruta</h2>
        <p>
          Explora sabores, artesanía y puestos verificados por la comunidad.
        </p>
        <Button className="full" onClick={() => enter(true)}>
          <span className="google">G</span>Continuar con Google
        </Button>
        <Button className="full" kind="secondary" onClick={() => enter(false)}>
          Entrar como invitado
        </Button>
        <small>
          Como invitado puedes explorar. Inicia sesión para guardar rutas y
          favoritos.
        </small>
      </section>
    </main>
  )
}

const PINS = [
  { id: 1, top: "31%", left: "23%", food: true, verified: true, name: "El Mero Norteño", kind: "Cevichería · Puesto 42", desc: "Mar fresco, receta de siempre.", rating: 4.8, reviews: 126, price: 2, opens: 10, closes: 16, ref: "Mercado Central, columna amarilla 6", dist: 120, tags: ["Ceviche", "Mercados"], review: "El ceviche es fresco y la atención te hace sentir en casa." },
  { id: 2, top: "47%", left: "67%", food: false, verified: true, name: "Artesanías Tallán", kind: "Artesanía · Pasaje 3", desc: "Cerámica y paja toquilla hechas a mano.", rating: 4.6, reviews: 58, price: 2, opens: 9, closes: 19, ref: "Pasaje artesanal, frente a la plaza", dist: 380, tags: ["Cerámica", "Textiles"], review: "Piezas únicas y precios claros." },
  { id: 3, top: "62%", left: "38%", food: true, verified: false, name: "Café Don Oscar", kind: "Cafetería · Puesto 11", desc: "Café de altura y dulces piuranos.", rating: 4.2, reviews: 34, price: 1, opens: 7, closes: 13, ref: "Jr. Huancavelica, junto a columna 14", dist: 640, tags: ["Café", "Dulces"], review: "Buen café, ideal para el desayuno." },
  { id: 4, top: "26%", left: "79%", food: false, verified: true, name: "Taller de Sombreros", kind: "Comercio · Av. Grau", desc: "Sombreros de paja toquilla a medida.", rating: 4.7, reviews: 41, price: 3, opens: 9, closes: 18, ref: "Av. Grau, cuadra 5", dist: 910, tags: ["Paja toquilla", "Joyería"], review: "Trabajo fino y trato amable." },
  { id: 5, top: "70%", left: "74%", food: true, verified: true, name: "Cabrito del Norte", kind: "Restaurante · Puesto 27", desc: "Seco de cabrito y chavelo como en casa.", rating: 4.5, reviews: 203, price: 2, opens: 11, closes: 17, ref: "Mercado Central, columna azul 9", dist: 450, tags: ["Cabrito", "Seco de chavelo"], review: "Porciones generosas y buen sazón." },
]

export function Pin({
  pin,
  match,
  open,
}: {
  pin: Place
  match: boolean
  open: () => void
}) {
  const Icon = pin.food ? Utensils : Store
  return (
    <button
      className={`pin ${pin.food ? "" : "shop"}`}
      style={{ top: pin.top, left: pin.left }}
      onClick={open}
      aria-label="Ver lugar"
    >
      {match && (
        <i className="match">
          <Heart size={10} fill="currentColor" />
        </i>
      )}
      <Icon size={17} />
      {pin.verified && (
        <i className="verified">
          <Check size={10} />
        </i>
      )}
    </button>
  )
}

function MapView() {
  const { favs, settings, tastes, openPlace, openAi, notify, goto, needLogin, user } = useApp()
  const [filter, setFilter] = useState("Descubre")
  const [near, setNear] = useState(false)
  const [q, setQ] = useState<string | null>(null)
  const shown = PINS.filter(
    (p) =>
      (filter === "Descubre" ||
        (filter === "Favoritos" && favs.includes(p.id)) ||
        (filter === "Restaurantes" && p.food) ||
        (filter === "Comercios" && !p.food) ||
        (filter === "Verificados" && p.verified)) &&
      (!near || p.dist < 500) &&
      (!q || p.name.toLowerCase().includes(q.toLowerCase())),
  )
  const toggleNear = () => {
    if (!near && !settings.gps) return notify("Activa la ubicación en Ajustes")
    setNear(!near)
    notify(!near ? "Mostrando lugares a menos de 500 m" : "Mostrando todos los lugares")
  }
  const pick = (x: string) => {
    if (x === "Favoritos" && !user) return needLogin()
    setFilter(x)
  }
  return (
    <section className="map" aria-label="Mapa de Piura">
      <div className="map-canvas">
        <i className="road r1" />
        <i className="road r2" />
        <i className="road r3" />
        <span className="map-label market">Mercado de Piura</span>
        <span className="map-label plaza">Plaza de Armas</span>
        {shown.map((pin) => (
          <Pin key={pin.id} pin={pin} match={pin.tags.some((t) => tastes.includes(t))} open={() => openPlace(pin.id)} />
        ))}
      </div>
      {!shown.length && (
        <div className="map-empty">
          No hay lugares con estos filtros.
          <Button kind="secondary" onClick={() => { setFilter("Descubre"); setNear(false); setQ(null) }}>
            Limpiar filtros
          </Button>
        </div>
      )}
      <header className="map-head">
        <div>
          <Logo small />
          <span className="hbtns">
            <Button kind="icon" label="Buscar" onClick={() => setQ(q === null ? "" : null)}>
              <Search size={20} />
            </Button>
            <Button kind="icon" label="Ajustes" onClick={() => goto("ajustes")}>
              <Settings size={20} />
            </Button>
          </span>
        </div>
        {q !== null && (
          <div className="search">
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar puesto o comida" aria-label="Buscar" />
          </div>
        )}
        <nav>
          {["Descubre", "Favoritos", "Restaurantes", "Comercios", "Verificados"].map((x) => (
            <Chip key={x} active={x === filter} onClick={() => pick(x)}>
              {x === "Verificados" && <BadgeCheck size={14} />}
              {x}
            </Chip>
          ))}
        </nav>
      </header>
      <Button kind="secondary" className={`near ${near ? "on" : ""}`} onClick={toggleNear}>
        <LocateFixed size={18} />
        Cerca de mí <small>500 m</small>
      </Button>
      <button className="ai-orb" onClick={openAi}>
        <Sparkles size={20} />
        Arma mi ruta
      </button>
    </section>
  )
}

export function PlaceSheet({ place, close }: { place: Place; close: () => void }) {
  const { favs, toggleFav, addStop, notify, needLogin, user } = useApp()
  const [reporting, setReporting] = useState(false)
  const fav = favs.includes(place.id)
  const h = new Date().getHours()
  const open = h >= place.opens && h < place.closes
  const report = (what: string) => {
    setReporting(false)
    notify("Reporte enviado: " + what)
  }
  return (
    <div className="layer" role="dialog" aria-label="Detalle del lugar">
      <button className="backdrop" onClick={close} aria-label="Cerrar" />
      <article className="sheet place-sheet">
        <i className="handle" />
        <div className="place-photo">
          <img src={place.food ? IMG.food : IMG.market} alt={place.name} />
          <Button kind="icon" label="Favorito" onClick={() => (user ? toggleFav(place.id) : needLogin())}>
            <Heart fill={fav ? "currentColor" : "none"} />
          </Button>
          <span className={place.verified ? "" : "unv"}>
            <BadgeCheck size={15} />
            {place.verified ? "Sello vigente" : "Sin verificar"}
          </span>
        </div>
        <div className="place-body">
          <header>
            <div>
              <em>{place.kind}</em>
              <h2>{place.name}</h2>
            </div>
            <Button kind="icon" label="Agregar a mi ruta" onClick={() => (user ? addStop(place.id) : needLogin())}>
              <Plus />
            </Button>
          </header>
          <p>{place.desc}</p>
          <div className="stats">
            <span>
              <Star size={16} fill="currentColor" /> <b>{place.rating}</b> ({place.reviews})
            </span>
            <span title="Nivel de precio">
              {"🪙".repeat(place.price)}
              <i>{"🪙".repeat(3 - place.price)}</i>
            </span>
          </div>
          <div className="meta">
            <span>
              <MapPin size={17} />
              {place.ref} · a {place.dist} m
            </span>
            <span style={open ? undefined : { color: "#b91c1c" }}>
              <Clock3 size={17} />
              {open ? "Abierto ahora" : "Cerrado ahora"} · Cierra {place.closes > 12 ? place.closes - 12 : place.closes}:00 {place.closes >= 12 ? "p. m." : "a. m."}
            </span>
          </div>
          <Button
            className="full"
            onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place.name + " Piura"), "_blank")}
          >
            <Navigation size={18} />
            Cómo llegar
          </Button>
          <div className="section-title">
            <h3>Lo que dice la gente</h3>
            <span>{place.reviews} reseñas</span>
          </div>
          <blockquote>“{place.review}”</blockquote>
          {reporting ? (
            <div className="report-list">
              <Button kind="secondary" onClick={() => report("no abrió o cerró fuera de horario")}>No abrió / cerró fuera de horario</Button>
              <Button kind="secondary" onClick={() => report("cambió de ubicación")}>Cambió de ubicación</Button>
              <Button kind="secondary" onClick={() => report("cambió el precio")}>Cambió el precio</Button>
              <Button kind="ghost" onClick={() => setReporting(false)}>Cancelar</Button>
            </div>
          ) : (
            <Button kind="ghost" className="full" onClick={() => setReporting(true)}>
              Reportar cambio
            </Button>
          )}
        </div>
      </article>
    </div>
  )
}

const QUESTIONS = [
  [
    "¿En qué momento salimos?",
    "Así elegimos los mejores puestos abiertos.",
    "Desayuno",
    "Almuerzo",
    "Cena",
  ],
  [
    "¿Cuál es tu presupuesto?",
    "Por persona, aproximadamente.",
    "Económico",
    "Mediano",
    "Sin límite",
  ],
  [
    "¿Cuánto tiempo tienes?",
    "La ruta se adapta a tu ritmo.",
    "1 hora",
    "2 horas",
    "Medio día",
  ],
  [
    "¿Qué se te antoja?",
    "Puedes elegir más de uno.",
    "Ceviche",
    "Dulces",
    "Artesanía",
    "Café",
  ],
]

export function AIChat({
  close,
  confirm,
}: {
  close: () => void
  confirm: (ids: number[]) => void
}) {
  const [step, setStep] = useState(0)
  const [chosen, setChosen] = useState<string[]>([])
  const choose = (x: string) =>
    setChosen(
      step === 3
        ? chosen.includes(x)
          ? chosen.filter((y) => y !== x)
          : [...chosen, x]
        : [x],
    )
  return (
    <div className="layer" role="dialog" aria-label="Asistente de IA">
      <button className="backdrop" onClick={close} aria-label="Cerrar" />
      <article className="sheet ai-sheet">
        <i className="handle" />
        <header className="sheet-head">
          <div>
            <i>
              <Sparkles size={19} />
            </i>
            <span>
              <h2>Ruta con IA</h2>
              <p>Tu copiloto piurano</p>
            </span>
          </div>
          <Button kind="icon" onClick={close} label="Cerrar">
            <X />
          </Button>
        </header>
        {step < 4 ? (
          <>
            <Stepper step={step + 1} />
            <section className="question">
              <h3>{QUESTIONS[step][0]}</h3>
              <p>{QUESTIONS[step][1]}</p>
              <div>
                {QUESTIONS[step].slice(2).map((x) => (
                  <Chip
                    key={x}
                    active={chosen.includes(x)}
                    onClick={() => choose(x)}
                  >
                    {chosen.includes(x) && <Check size={15} />}
                    {x}
                  </Chip>
                ))}
              </div>
            </section>
            <Button
              className="full"
              disabled={!chosen.length}
              onClick={() => {
                setStep(step + 1)
                setChosen([])
              }}
            >
              Continuar <ChevronRight size={18} />
            </Button>
          </>
        ) : (
          <RouteResult confirm={confirm} />
        )}
      </article>
    </div>
  )
}

function RouteResult({ confirm }: { confirm: (ids: number[]) => void }) {
  const [ids, setIds] = useState([1, 5, 2])
  const move = (i: number, d: number) => {
    const t = i + d
    if (t < 0 || t >= ids.length) return
    const n = [...ids]
    ;[n[i], n[t]] = [n[t], n[i]]
    setIds(n)
  }
  const addNext = () => {
    const next = PINS.find((p) => p.verified && !ids.includes(p.id))
    if (next) setIds([...ids, next.id])
  }
  return (
    <section className="result">
      <i className="result-icon">
        <Route />
      </i>
      <em>Ruta lista · {ids.length} paradas verificadas</em>
      <h3>Sabores y manos de Piura</h3>
      <p>Solo puestos con sello vigente. Edítala a tu gusto.</p>
      <div className="editable">
        {ids.map((id, i) => (
          <article key={id}>
            <GripVertical size={17} />
            <span>{i + 1}</span>
            <b>{PINS.find((p) => p.id === id)!.name}</b>
            <div>
              <button aria-label="Subir" onClick={() => move(i, -1)}><ArrowUp size={15} /></button>
              <button aria-label="Bajar" onClick={() => move(i, 1)}><ArrowDown size={15} /></button>
              <button aria-label="Quitar" onClick={() => setIds(ids.filter((s) => s !== id))}><Trash2 size={15} /></button>
            </div>
          </article>
        ))}
      </div>
      <Button kind="secondary" className="full" onClick={addNext} disabled={!PINS.some((p) => p.verified && !ids.includes(p.id))}>
        <Plus size={18} />
        Agregar parada
      </Button>
      <Button className="full" disabled={!ids.length} onClick={() => confirm(ids)}>
        <Check size={18} />
        Confirmar ruta
      </Button>
    </section>
  )
}

function Top({ title, over }: { title: string; over: string }) {
  const { goto } = useApp()
  return (
    <header className="top">
      <div>
        <em>{over}</em>
        <h1>{title}</h1>
      </div>
      <Button kind="icon" label="Ajustes" onClick={() => goto("ajustes")}>
        <Settings size={20} />
      </Button>
    </header>
  )
}

export function RouteList() {
  const { route, setRoute, times, setTimes, openAi, openPlace, notify, settings, goto } = useApp()
  const [edit, setEdit] = useState(false)
  const stops: Place[] = route.map((id: number) => PINS.find((p) => p.id === id)!)
  const timeOf = (id: number, i: number) => times[id] ?? `${String(10 + i).padStart(2, "0")}:00`
  const text = () =>
    "Mi ruta en PiuraRuta:\n" + stops.map((s, i) => `${i + 1}. ${timeOf(s.id, i)} ${s.name} (${s.ref})`).join("\n")
  const move = (i: number, d: number) => {
    const t = i + d
    if (t < 0 || t >= route.length) return
    const n = [...route]
    ;[n[i], n[t]] = [n[t], n[i]]
    setRoute(n)
  }
  if (!stops.length)
    return (
      <main className="page">
        <Top title="Mi ruta" over="Aún sin plan" />
        <div className="empty">
          <Route size={36} />
          <b>Todavía no tienes una ruta</b>
          <span>Pide una a la IA o agrega lugares con el botón + desde el mapa.</span>
          <Button onClick={openAi}><Sparkles size={18} />Armar ruta con IA</Button>
          <Button kind="secondary" onClick={() => goto("mapa")}>Explorar el mapa</Button>
        </div>
      </main>
    )
  return (
    <main className="page">
      <Top title="Mi ruta" over="Tu plan en Piura" />
      <section className="route-hero">
        <header>
          <span><Check size={13} />Confirmada</span>
          <small>{stops.length} paradas</small>
        </header>
        <h2>Sabores y manos de Piura</h2>
        <p>{stops.length} paradas con sello o verificación pendiente</p>
      </section>
      <div className="section-title">
        <h2>Tu recorrido</h2>
        <button className="link" onClick={() => setEdit(!edit)}>{edit ? "Listo" : "Editar"}</button>
      </div>
      <section className="route-stops">
        {stops.map((s, i) => (
          <article key={s.id}>
            <div className="timeline">
              <b>{i + 1}</b>
              {i < stops.length - 1 && <i />}
            </div>
            <div>
              <input className="stop-time" type="time" aria-label={"Hora en " + s.name} value={timeOf(s.id, i)} onChange={(e) => setTimes({ ...times, [s.id]: e.target.value })} />
              <h3>{s.name}</h3>
              <p>{s.kind}</p>
            </div>
            {edit ? (
              <div className="stop-actions">
                <button className="ic" aria-label="Subir" onClick={() => move(i, -1)}><ArrowUp size={16} /></button>
                <button className="ic" aria-label="Bajar" onClick={() => move(i, 1)}><ArrowDown size={16} /></button>
                <button className="ic" aria-label="Quitar" onClick={() => setRoute(route.filter((x: number) => x !== s.id))}><Trash2 size={16} /></button>
              </div>
            ) : (
              <button className="ic" aria-label={"Ver " + s.name} onClick={() => openPlace(s.id)}><ChevronRight /></button>
            )}
          </article>
        ))}
      </section>
      <aside className="reminder">
        <Clock3 />
        <div>
          <b>{settings.notifications ? "Recordatorio activado" : "Recordatorios desactivados"}</b>
          <p>{settings.notifications ? "Te avisaremos 30 minutos antes de cada parada." : "Actívalos en Ajustes."}</p>
        </div>
        {!settings.notifications && <button className="link" onClick={() => goto("ajustes")}>Ajustes</button>}
      </aside>
      <div className="share">
        <Button kind="secondary" onClick={() => window.print()}>
          <Download size={18} />
          PDF
        </Button>
        <Button kind="secondary" onClick={() => window.open("https://wa.me/?text=" + encodeURIComponent(text()), "_blank")}>
          <MessageCircle size={18} />
          WhatsApp
        </Button>
      </div>
      <Button className="full" onClick={openAi}>
        <Sparkles size={18} />
        Pedir nueva ruta a la IA
      </Button>
    </main>
  )
}

const GROUPS = [
  ["Comida", "Ceviche", "Seco de chavelo", "Cabrito", "Dulces"],
  ["Artesanía", "Cerámica", "Paja toquilla", "Textiles", "Joyería"],
  ["Experiencias", "Mercados", "Historia", "Talleres", "Café"],
]
export function Tastes({ notify }: { notify: (x: string) => void }) {
  const { tastes: selected, setTastes: setSelected } = useApp()
  const toggle = (x: string) =>
    setSelected(
      selected.includes(x) ? selected.filter((y: string) => y !== x) : [...selected, x],
    )
  return (
    <main className="page tastes">
      <Top title="Tus gustos" over="Haz el mapa más tuyo" />
      <p className="intro">
        Elige lo que te mueve. Marcaremos coincidencias especiales en el mapa.
      </p>
      {GROUPS.map((g) => (
        <section key={g[0]}>
          <div className="section-title">
            <h2>{g[0]}</h2>
            <span>
              {g.slice(1).filter((x) => selected.includes(x)).length} elegidos
            </span>
          </div>
          <div className="taste-grid">
            {g.slice(1).map((x, i) => (
              <button
                key={x}
                className={selected.includes(x) ? "selected" : ""}
                onClick={() => toggle(x)}
              >
                <i>{["✦", "◉", "⌁", "◇"][i]}</i>
                <b>{x}</b>
                <span>{selected.includes(x) && <Check size={14} />}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
      <Button
        className="full save"
        onClick={() => notify("Tus gustos fueron guardados")}
      >
        Guardar mis gustos
      </Button>
    </main>
  )
}

function Profile() {
  const { user, login, goto } = useApp()
  return (
    <main className="page">
      <Top title="Tu perfil" over={user ? "Cuenta Google" : "Viajero invitado"} />
      <section className="profile">
        <i><UserRound /></i>
        <div>
          <h2>Hola, {user ? user.name : "viajero"}</h2>
          <p>{user ? "Tus rutas y favoritos están activos." : "Inicia sesión para guardar rutas, favoritos y usar la IA."}</p>
        </div>
        {!user && <Button onClick={login}>Continuar con Google</Button>}
      </section>
      <button className="row" onClick={() => goto("ajustes")}>
        <Settings /><span><b>Ajustes</b><small>Notificaciones, ubicación y accesibilidad</small></span><ChevronRight />
      </button>
      <div className="section-title"><h2>Siempre te acompañamos</h2></div>
      <section className="states">
        <article><LocateFixed /><div><b>GPS bajo tu control</b><p>Explora aunque no compartas tu ubicación.</p></div></article>
        <article><ShieldCheck /><div><b>Confianza visible</b><p>Revisamos periódicamente cada sello.</p></div></article>
      </section>
    </main>
  )
}

function Toggle({ on, set, label, hint, icon }: { on: boolean; set: (v: boolean) => void; label: string; hint: string; icon: ReactNode }) {
  return (
    <button className="row" role="switch" aria-checked={on} onClick={() => set(!on)}>
      {icon}
      <span><b>{label}</b><small>{hint}</small></span>
      <i className={`sw ${on ? "on" : ""}`} />
    </button>
  )
}

function SettingsPage() {
  const { settings, setSettings, user, logout, clearData, goto, notify } = useApp()
  const set = (k: string) => (v: boolean) => {
    setSettings({ ...settings, [k]: v })
    if (k === "gps" && v && navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        () => notify("Ubicación activada"),
        () => { setSettings({ ...settings, gps: false }); notify("Permiso de ubicación denegado") },
      )
    if (k === "notifications" && v && "Notification" in window) Notification.requestPermission()
  }
  return (
    <main className="page">
      <header className="top">
        <div><em>Preferencias</em><h1>Ajustes</h1></div>
        <Button kind="icon" label="Volver" onClick={() => goto("perfil")}><ChevronLeft /></Button>
      </header>
      <Toggle on={settings.notifications} set={set("notifications")} label="Recordatorios" hint="Avisos antes de cada parada" icon={<Bell />} />
      <Toggle on={settings.gps} set={set("gps")} label="Ubicación (GPS)" hint="Necesaria para “Cerca de mí”" icon={<LocateFixed />} />
      <Toggle on={settings.big} set={set("big")} label="Texto grande" hint="Mejor lectura bajo el sol" icon={<Type />} />
      <Toggle on={settings.contrast} set={set("contrast")} label="Alto contraste" hint="Textos y bordes más marcados" icon={<Sun />} />
      <button className="row" onClick={() => { clearData(); notify("Favoritos y ruta borrados") }}>
        <Trash2 /><span><b>Borrar favoritos y ruta</b><small>Empieza desde cero</small></span>
      </button>
      {user && (
        <button className="row" onClick={logout}>
          <LogOut /><span><b>Cerrar sesión</b><small>Volverás a ser invitado</small></span>
        </button>
      )}
    </main>
  )
}

function BottomNav({
  active,
  change,
}: {
  active: Screen
  change: (x: Screen) => void
}) {
  const items: [Screen, string, typeof MapIcon][] = [
    ["mapa", "Mapa", MapIcon],
    ["ruta", "Mi ruta", Route],
    ["gustos", "Gustos", Heart],
    ["perfil", "Perfil", UserRound],
  ]
  return (
    <nav className="bottom-nav">
      {items.map(([id, label, Icon]) => (
        <button
          key={id}
          className={id === active ? "active" : ""}
          onClick={() => change(id)}
        >
          <i>
            <Icon size={20} />
          </i>
          {label}
        </button>
      ))}
    </nav>
  )
}

function Shell({ user, login, logout }: { user: { name: string } | null; login: () => void; logout: () => void }) {
  const [screen, setScreen] = useState<Screen>("mapa")
  const [placeId, setPlaceId] = useState<number | null>(null)
  const [ai, setAi] = useState(false)
  const [toast, setToast] = useState("")
  const [favs, setFavs] = useState<number[]>([])
  const [route, setRoute] = useState<number[]>([])
  const [times, setTimes] = useState<Record<number, string>>({})
  const [tastes, setTastes] = useState<string[]>(["Ceviche", "Mercados", "Cerámica"])
  const [settings, setSettings] = useState({ notifications: true, gps: true, big: false, contrast: false })
  const notify = (x: string) => {
    setToast(x)
    setTimeout(() => setToast(""), 2500)
  }
  const needLogin = () => {
    setPlaceId(null)
    setAi(false)
    setScreen("perfil")
    notify("Inicia sesión con Google para usar esta función")
  }
  const toggleFav = (id: number) => {
    notify(favs.includes(id) ? "Quitado de favoritos" : "Guardado en favoritos")
    setFavs(favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id])
  }
  const addStop = (id: number) => {
    if (route.includes(id)) return notify("Ya está en tu ruta")
    setRoute([...route, id])
    notify("Agregado a tu ruta")
  }
  const ctx = {
    user, login, logout, favs, toggleFav, route, setRoute, addStop, times, setTimes, tastes, setTastes,
    settings, setSettings, notify, needLogin, goto: setScreen,
    openPlace: setPlaceId, openAi: () => (user ? setAi(true) : needLogin()),
    clearData: () => { setFavs([]); setRoute([]); setTimes({}) },
  }
  const place = PINS.find((p) => p.id === placeId)
  return (
    <Ctx.Provider value={ctx}>
      <div className={`app ${settings.big ? "big" : ""} ${settings.contrast ? "hc" : ""}`}>
        {screen === "mapa" ? <MapView /> : screen === "ruta" ? <RouteList /> : screen === "gustos" ? <Tastes notify={notify} /> : screen === "ajustes" ? <SettingsPage /> : <Profile />}
        <BottomNav active={screen} change={setScreen} />
        {place && <PlaceSheet place={place} close={() => setPlaceId(null)} />}
        {ai && (
          <AIChat
            close={() => setAi(false)}
            confirm={(ids) => {
              setRoute(ids)
              setAi(false)
              setScreen("ruta")
              notify("Ruta confirmada")
            }}
          />
        )}
        {toast && <Toast text={toast} />}
      </div>
    </Ctx.Provider>
  )
}

export default function App() {
  const [phase, setPhase] = useState<"splash" | "access" | "app">("splash")
  const [user, setUser] = useState<{ name: string } | null>(null)
  const login = () => setUser({ name: "viajero" })
  return phase === "splash" ? (
    <Splash done={() => setPhase("access")} />
  ) : phase === "access" ? (
    <Access enter={(google) => { if (google) login(); setPhase("app") }} />
  ) : (
    <Shell user={user} login={login} logout={() => setUser(null)} />
  )
}
