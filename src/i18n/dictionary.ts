export type Lang = "pt" | "en";
export type Localized = Record<Lang, string>;

const pt = {
  meta: { title: "Arthur Gabriel — portfólio" },
  nav: {
    works: "Projetos",
    experience: "Experiências",
    contact: "Contato",
    about: "Sobre",
    menu: "Menu",
    close: "Fechar",
    langLabel: "Idioma",
  },
  ring: {
    soon: "Em breve",
    hint: "Passe o mouse pelos projetos",
  },
  project: {
    back: "Voltar",
    stack: "Feito com",
    repo: "Ver repositório",
    noGif: "Gravação em breve",
    timeline: "Linha do tempo",
    prev: "Anterior",
    next: "Próximo",
    of: "de",
  },
  about: {
    section: "Sobre mim",
    coords: "Belo Horizonte — 19°55′S 43°56′W",
    caption: "fig. 1 — Arthur Gabriel",
    lead:
      "Estudo Engenharia de Software na PUC Minas e trabalho como desenvolvedor RPA na DW LAW. Gosto de entender como uma coisa funciona por dentro antes de mexer nela.",
    body: [
      "Tenho 21 anos e sou de Belo Horizonte. Comecei a programar fazendo sites e pequenos jogos no navegador, e foi assim que percebi que queria trabalhar com isso. Hoje, na faculdade, estou indo além da tela: estruturas de dados, orientação a objetos, arquitetura e as partes menos visíveis de um sistema.",
      "No trabalho, escrevo robôs que automatizam processos que antes eram feitos à mão. É um tipo de problema de que gosto muito: mapear cada passo de uma tarefa, achar onde ela pode dar errado e deixar o processo mais rápido e confiável para quem depende dele.",
      "Fora do código, treino Jiu-Jitsu, que me ensinou mais sobre paciência e constância do que qualquer outra coisa, e leio bastante. Também tenho o hábito de anotar ideias soltas e transformar algumas delas em projetos; boa parte do que está neste site começou assim.",
      "Meu objetivo agora é crescer como engenheiro de software: participar de produtos maiores, escrever código que dure e aprender com gente mais experiente. Sou uma pessoa tranquila e esforçada e, quando coloco um objetivo na cabeça, vou atrás dele.",
    ],
    facts: [
      ["Nome", "Arthur Gabriel"],
      ["Idade", "21 anos"],
      ["Base", "Belo Horizonte, MG"],
      ["Formação", "Engenharia de Software, PUC Minas (em curso)"],
      ["Hoje", "Desenvolvedor RPA na DW LAW"],
      ["Interesses", "Automação, desenvolvimento web, Jiu-Jitsu, livros"],
    ] as [string, string][],
  },
  experience: {
    section: "Experiências",
    count: (n: number) => (n === 1 ? "1 registro" : `${n} registros`),
    cols: { when: "Período", where: "Onde", what: "O quê" },
    now: "atual",
    kinds: {
      job: "Emprego",
      internship: "Estágio",
      freelance: "Freela",
      opensource: "Open source",
      event: "Evento",
      academic: "Acadêmico",
    },
  },
  contact: {
    section: "Contato",
    localTime: "Em BH agora",
    greeting: "Oi, Arthur!",
    nameBefore: "Meu nome é",
    namePh: "seu nome",
    emailBefore: "e você pode me responder em",
    emailPh: "seu@email.com",
    messagePh: "Escreva aqui o que você quer me dizer…",
    send: "Enviar mensagem",
    sending: "Enviando…",
    sent: "Mensagem enviada. Obrigado! Respondo assim que puder.",
    failed: "Não consegui enviar agora. Tente de novo ou me chame por um dos canais ao lado.",
    notConfigured: "O envio por formulário está indisponível no momento. Use um dos canais ao lado.",
    channels: "Ou, se preferir",
    errors: {
      name: { required: "Faltou o seu nome.", short: "Nome muito curto.", long: "Nome muito longo.", invalid: "Nome inválido." },
      email: { required: "Faltou o seu e-mail.", short: "E-mail inválido.", long: "E-mail inválido.", invalid: "Esse e-mail não parece válido." },
      message: {
        required: "Faltou a mensagem.",
        short: "Escreva pelo menos 10 caracteres.",
        long: "A mensagem passou de 2000 caracteres.",
        invalid: "Mensagem inválida.",
      },
    },
  },
  foot: {
    rights: "Arthur Gabriel",
    top: "Voltar ao topo",
  },
};

export type Dict = typeof pt;

const en: Dict = {
  meta: { title: "Arthur Gabriel — portfolio" },
  nav: {
    works: "Projects",
    experience: "Experience",
    contact: "Contact",
    about: "About",
    menu: "Menu",
    close: "Close",
    langLabel: "Language",
  },
  ring: {
    soon: "Coming soon",
    hint: "Hover over the projects",
  },
  project: {
    back: "Back",
    stack: "Built with",
    repo: "View repository",
    noGif: "Recording coming soon",
    timeline: "Timeline",
    prev: "Previous",
    next: "Next",
    of: "of",
  },
  about: {
    section: "About me",
    coords: "Belo Horizonte — 19°55′S 43°56′W",
    caption: "fig. 1 — Arthur Gabriel",
    lead:
      "I study Software Engineering at PUC Minas and work as an RPA developer at DW LAW. I like to understand how something works on the inside before I touch it.",
    body: [
      "I'm 21 and I'm from Belo Horizonte, Brazil. I started programming by building websites and small browser games, and that's how I realized this was what I wanted to do. Now, at university, I'm going beyond the screen: data structures, object orientation, architecture and the less visible parts of a system.",
      "At work, I write bots that automate processes that used to be done by hand. It's the kind of problem I really enjoy: mapping every step of a task, finding where it can go wrong and making it faster and more reliable for the people who depend on it.",
      "Away from code, I train Jiu-Jitsu, which has taught me more about patience and consistency than anything else, and I read a lot. I also have a habit of writing down loose ideas and turning some of them into projects; much of what's on this site started that way.",
      "My goal right now is to grow as a software engineer: to work on bigger products, write code that lasts and learn from more experienced people. I'm a calm, hard-working person, and once I set a goal, I go after it.",
    ],
    facts: [
      ["Name", "Arthur Gabriel"],
      ["Age", "21"],
      ["Based in", "Belo Horizonte, Brazil"],
      ["Education", "Software Engineering, PUC Minas (in progress)"],
      ["Now", "RPA Developer at DW LAW"],
      ["Interests", "Automation, web development, Jiu-Jitsu, books"],
    ],
  },
  experience: {
    section: "Experience",
    count: (n: number) => (n === 1 ? "1 entry" : `${n} entries`),
    cols: { when: "When", where: "Where", what: "What" },
    now: "present",
    kinds: {
      job: "Job",
      internship: "Internship",
      freelance: "Freelance",
      opensource: "Open source",
      event: "Event",
      academic: "Academic",
    },
  },
  contact: {
    section: "Contact",
    localTime: "Time in BH",
    greeting: "Hi, Arthur!",
    nameBefore: "My name is",
    namePh: "your name",
    emailBefore: "and you can reach me at",
    emailPh: "you@email.com",
    messagePh: "Write what you'd like to tell me…",
    send: "Send message",
    sending: "Sending…",
    sent: "Message sent. Thank you! I'll get back to you as soon as I can.",
    failed: "I couldn't send it right now. Try again or reach me through one of the channels.",
    notConfigured: "The form is unavailable at the moment. Please use one of the channels.",
    channels: "Or, if you prefer",
    errors: {
      name: { required: "Your name is missing.", short: "Name is too short.", long: "Name is too long.", invalid: "Invalid name." },
      email: { required: "Your e-mail is missing.", short: "Invalid e-mail.", long: "Invalid e-mail.", invalid: "That e-mail doesn't look valid." },
      message: {
        required: "The message is missing.",
        short: "Write at least 10 characters.",
        long: "The message is over 2000 characters.",
        invalid: "Invalid message.",
      },
    },
  },
  foot: {
    rights: "Arthur Gabriel",
    top: "Back to top",
  },
};

export const dictionary: Record<Lang, Dict> = { pt, en };
