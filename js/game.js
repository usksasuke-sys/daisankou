"use strict";

var KEY = "daisankou";
var state = load();

function fresh() {
  return {
    screen: "title",
    place: "reception",
    person: "",
    node: "",
    inspect: "",
    seen: {},
    heard: {},
    notes: [],
    hints: 0,
    memo: "",
    charge: { step: 1, person: "", alibi: "", method: "" },
    solved: false,
    revealed: false,
    result: { closed: false, key: "" },
    beforeScreen: "place",
    confirm: "",
    noteFresh: false
  };
}

function load() {
  var next = fresh();
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || "");
    if (!saved || !saved.seen || !saved.heard) return next;
    ["screen", "place", "person", "node", "inspect", "hints", "memo", "solved", "revealed", "beforeScreen", "confirm"].forEach(function (key) {
      if (saved[key] !== undefined && saved[key] !== null) next[key] = saved[key];
    });
    next.seen = saved.seen;
    next.heard = saved.heard;
    next.notes = saved.notes || [];
    next.charge = saved.charge || next.charge;
    next.result = saved.result || next.result;
    if (!placeById(next.place)) next.place = "reception";
    if (next.screen === "talk" && !CASE.nodes[next.node]) next.screen = "place";
    if (next.screen === "inspect" && !spotById(next.inspect)) next.screen = "place";
  } catch (error) {
    return fresh();
  }
  return next;
}

function save() {
  var freshNote = state.noteFresh;
  state.noteFresh = false;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (error) {}
  state.noteFresh = freshNote;
}

function placeById(id) {
  for (var i = 0; i < CASE.places.length; i += 1) {
    if (CASE.places[i].id === id) return CASE.places[i];
  }
  return null;
}

function spotById(id) {
  for (var i = 0; i < CASE.places.length; i += 1) {
    var spots = CASE.places[i].spots || [];
    for (var j = 0; j < spots.length; j += 1) {
      if (spots[j].id === id) return spots[j];
    }
  }
  return null;
}

function personById(id) {
  for (var i = 0; i < CASE.people.length; i += 1) {
    if (CASE.people[i].id === id) return CASE.people[i];
  }
  return null;
}

function peopleHere(placeId) {
  return CASE.people.filter(function (person) {
    return person.place === placeId;
  });
}

function labelOf(list, id) {
  for (var i = 0; i < list.length; i += 1) {
    if (list[i].id === id) return list[i].label;
  }
  return "";
}

function hasFact(id) {
  return !!(state.seen[id] || state.heard[id]);
}

function visibleChoices(node) {
  return (node.choices || []).filter(function (choice) {
    if (choice.need && !hasFact(choice.need)) return false;
    if (choice.after && !hasFact(choice.after)) return false;
    if (choice.unless && hasFact(choice.unless)) return false;
    if (choice.needAll && choice.needAll.some(function (id) { return !hasFact(id); })) return false;
    return true;
  });
}

function addNote(id) {
  if (!id || !CASE.notes[id]) return false;
  if (state.notes.indexOf(id) !== -1) return false;
  state.notes.push(id);
  return true;
}

function el(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function btn(text, onClick, className) {
  var button = el("button", className || "choice", text);
  button.type = "button";
  button.addEventListener("click", onClick);
  return button;
}

function paragraphs(parent, lines, className) {
  lines.forEach(function (line) {
    parent.appendChild(el("p", className || "", line));
  });
}

function render() {
  save();
  var app = document.getElementById("app");
  app.innerHTML = "";
  if (state.screen === "title") renderTitle(app);
  else if (state.screen === "talk") renderTalk(app);
  else if (state.screen === "inspect") renderInspect(app);
  else if (state.screen === "notebook") renderNotebook(app);
  else if (state.screen === "accuse") renderAccuse(app);
  else if (state.screen === "result") renderResult(app);
  else if (state.screen === "hint") renderHint(app);
  else if (state.screen === "confirm") renderConfirm(app);
  else renderPlace(app);
  window.scrollTo(0, 0);
}

function renderTitle(app) {
  var main = el("main", "title-screen");
  main.appendChild(el("div", "seal", "三"));
  main.appendChild(el("p", "eyebrow", "シェアオフィス四階"));
  main.appendChild(el("h1", "game-title", CASE.title));
  main.appendChild(el("p", "lede", CASE.lead));
  main.appendChild(btn("フロアへ", start, "primary"));
  main.appendChild(el("p", "fine", "進行は、このブラウザの中に残ります。"));
  app.appendChild(main);
}

function start() {
  state.place = "reception";
  showNode("intro");
}

function showNode(id) {
  var node = CASE.nodes[id];
  if (!node) {
    state.screen = "place";
    render();
    return;
  }
  state.node = id;
  state.person = node.person;
  state.heard[id] = true;
  state.noteFresh = addNote(node.note);
  state.screen = "talk";
  render();
}

function closeTalk() {
  state.screen = "place";
  state.node = "";
  render();
}

function go(placeId) {
  state.place = placeId;
  state.screen = "place";
  var place = placeById(placeId);
  var enter = place && place.enter;
  if (enter && !state.seen[enter.unlessSeen] && !state.heard[enter.unlessHeard]) {
    showNode(enter.node);
    return;
  }
  render();
}

function inspect(id) {
  var spot = spotById(id);
  if (!spot) return;
  state.inspect = id;
  state.seen[id] = true;
  state.noteFresh = addNote(spot.note);
  state.screen = "inspect";
  render();
}

function talkTo(personId) {
  var person = personById(personId);
  if (!person) return;
  showNode(person.root);
}

function openScreen(name) {
  state.screen = name;
  render();
}

function ask(kind) {
  if (state.screen !== "confirm") state.beforeScreen = state.screen;
  state.confirm = kind;
  state.screen = "confirm";
  render();
}

function cancelAsk() {
  state.screen = state.beforeScreen || "place";
  render();
}

function resetGame() {
  localStorage.removeItem(KEY);
  state = fresh();
  render();
}

function revealAnswer() {
  state.revealed = true;
  state.result = { closed: false, key: "answer" };
  state.screen = "result";
  render();
}

function openEnding() {
  state.result = { closed: !!state.solved, key: state.solved ? "ending" : "answer" };
  state.screen = "result";
  render();
}

function openAccuse() {
  state.charge = { step: 1, person: "", alibi: "", method: "" };
  state.screen = "accuse";
  render();
}

function topbar(parent) {
  var bar = el("header", "top");
  var titles = el("div", "titles");
  var place = placeById(state.place);
  titles.appendChild(el("p", "eyebrow", CASE.title));
  titles.appendChild(el("h1", "place-name", place ? place.name : CASE.title));
  bar.appendChild(titles);
  var actions = el("div", "actions");
  actions.appendChild(btn("移動", function () { go("hall"); }, "nav"));
  actions.appendChild(btn("ノート", function () { openScreen("notebook"); }, "nav"));
  actions.appendChild(btn("告発", function () { openAccuse(); }, "nav"));
  actions.appendChild(btn("ヒント", function () { openScreen("hint"); }, "nav"));
  if (state.solved || state.revealed) actions.appendChild(btn("結末", openEnding, "nav"));
  actions.appendChild(btn("最初から", function () { ask("reset"); }, "nav quiet"));
  bar.appendChild(actions);
  parent.appendChild(bar);
}

function renderPlace(app) {
  var place = placeById(state.place) || placeById("hall");
  topbar(app);
  var main = el("main", "sheet");
  if (place.id === "hall") main.appendChild(renderMap());
  main.appendChild(el("p", "lead", place.lead));
  var people = peopleHere(place.id);
  if (people.length) {
    main.appendChild(el("h2", "section", "話せる人"));
    var row = el("div", "stack");
    people.forEach(function (person) {
      var button = btn("", function () { talkTo(person.id); }, "person");
      button.appendChild(el("span", "person-name", person.name));
      button.appendChild(el("span", "person-caption", person.caption));
      row.appendChild(button);
    });
    main.appendChild(row);
  }
  if (place.spots && place.spots.length) {
    main.appendChild(el("h2", "section", "調べる"));
    var spots = el("div", "stack");
    place.spots.forEach(function (spot) {
      var button = btn(spot.title, function () { inspect(spot.id); }, "spot");
      if (state.seen[spot.id]) button.appendChild(el("span", "seen", "見た"));
      spots.appendChild(button);
    });
    main.appendChild(spots);
  }
  app.appendChild(main);
}

function renderMap() {
  var wrap = el("div", "map-wrap");
  var map = el("div", "map");
  CASE.places.forEach(function (place) {
    var button = btn(place.name, function () { go(place.id); }, "room room-" + place.area);
    if (place.id === "hall") button.classList.add("current");
    map.appendChild(button);
  });
  wrap.appendChild(map);
  wrap.appendChild(el("p", "map-note", "西バルコニーから会議室の入口まで、徒歩一分。正面の入口は受付です。"));
  return wrap;
}

function renderInspect(app) {
  var spot = spotById(state.inspect);
  var main = el("main", "sheet narrow");
  if (!spot) {
    main.appendChild(btn("戻る", function () { state.screen = "place"; render(); }, "primary"));
    app.appendChild(main);
    return;
  }
  main.appendChild(el("p", "eyebrow", "調べる"));
  main.appendChild(el("h1", "screen-title", spot.title));
  var body = el("div", spot.kind === "record" ? "record" : "prose");
  paragraphs(body, spot.body);
  main.appendChild(body);
  if (state.noteFresh) main.appendChild(el("p", "fresh", "ノートに残しました。"));
  main.appendChild(btn("部屋へ戻る", function () { state.screen = "place"; render(); }, "primary"));
  app.appendChild(main);
}

function renderTalk(app) {
  var node = CASE.nodes[state.node];
  var person = personById(state.person);
  var main = el("main", "sheet narrow");
  if (!node || !person) {
    main.appendChild(btn("戻る", closeTalk, "primary"));
    app.appendChild(main);
    return;
  }
  main.appendChild(el("p", "eyebrow", person.caption));
  main.appendChild(el("h1", "screen-title", person.name));
  var body = el("div", "prose said");
  paragraphs(body, node.say);
  main.appendChild(body);
  if (state.noteFresh) main.appendChild(el("p", "fresh", "ノートに残しました。"));
  var choices = el("div", "stack");
  visibleChoices(node).forEach(function (choice) {
    choices.appendChild(btn(choice.label, function () {
      if (choice.exit) closeTalk();
      else if (choice.next) showNode(choice.next);
    }));
  });
  main.appendChild(choices);
  app.appendChild(main);
}

function renderNotebook(app) {
  topbar(app);
  var main = el("main", "sheet narrow");
  main.appendChild(el("h1", "screen-title", "ノート"));
  if (!state.notes.length) {
    main.appendChild(el("p", "lead", "まだ何も残していません。部屋の物を調べると、ここに残ります。"));
  }
  CASE.groups.forEach(function (group) {
    var items = state.notes.filter(function (id) {
      return CASE.notes[id] && CASE.notes[id].group === group;
    });
    if (!items.length) return;
    main.appendChild(el("h2", "section", group));
    var list = el("ul", "notes");
    items.forEach(function (id) {
      list.appendChild(el("li", "", CASE.notes[id].text));
    });
    main.appendChild(list);
  });
  var label = el("label", "memo-label", "自分のメモ");
  label.setAttribute("for", "memo");
  main.appendChild(label);
  var memo = el("textarea");
  memo.id = "memo";
  memo.value = state.memo;
  memo.placeholder = "気づいたことを書けます";
  memo.addEventListener("input", function () {
    state.memo = memo.value;
    save();
  });
  main.appendChild(memo);
  app.appendChild(main);
}

function renderAccuse(app) {
  var main = el("main", "sheet narrow");
  var charge = state.charge;
  main.appendChild(el("p", "eyebrow", "告発"));
  if (charge.step === 1) {
    main.appendChild(el("h1", "screen-title", "誰が入れ替えましたか"));
    main.appendChild(choiceList(CASE.charges.people, charge.person, function (id) {
      charge.person = id;
      charge.step = 2;
      render();
    }));
  } else if (charge.step === 2) {
    main.appendChild(el("h1", "screen-title", "崩れる説明はどれですか"));
    main.appendChild(el("p", "lead", "記録と合わない説明を選んでください。"));
    main.appendChild(choiceList(CASE.charges.alibis, charge.alibi, function (id) {
      charge.alibi = id;
      charge.step = 3;
      render();
    }));
  } else if (charge.step === 3) {
    main.appendChild(el("h1", "screen-title", "手口はどれですか"));
    main.appendChild(choiceList(CASE.charges.methods, charge.method, function (id) {
      charge.method = id;
      charge.step = 4;
      render();
    }));
  } else {
    main.appendChild(el("h1", "screen-title", "この読みで告発します"));
    main.appendChild(summary("人", labelOf(CASE.charges.people, charge.person)));
    main.appendChild(summary("崩れる説明", labelOf(CASE.charges.alibis, charge.alibi)));
    main.appendChild(summary("手口", labelOf(CASE.charges.methods, charge.method)));
    main.appendChild(btn("告発する", submitCharge, "primary"));
  }
  if (charge.step > 1) {
    main.appendChild(btn("一つ戻る", function () {
      charge.step -= 1;
      render();
    }, "quiet-block"));
  }
  main.appendChild(btn("フロアへ戻る", function () { state.screen = "place"; render(); }, "quiet-block"));
  main.appendChild(btn("答えを見る", function () { ask("answer"); }, "quiet-block"));
  app.appendChild(main);
}

function choiceList(list, selected, onPick) {
  var wrap = el("div", "stack");
  list.forEach(function (item) {
    var button = btn(item.label, function () { onPick(item.id); });
    if (item.id === selected) button.classList.add("selected");
    wrap.appendChild(button);
  });
  return wrap;
}

function summary(label, text) {
  var wrap = el("div", "summary");
  wrap.appendChild(el("p", "summary-label", label));
  wrap.appendChild(el("p", "summary-text", text));
  return wrap;
}

function submitCharge() {
  var judged = judge(state.charge.person, state.charge.alibi, state.charge.method);
  state.result = { closed: judged.closed, key: judged.key };
  if (judged.closed) state.solved = true;
  state.screen = "result";
  render();
}

function judge(person, alibi, method) {
  var pairs = { "aoki-shiraishi": true, "kurokawa-shiraishi": true, "aoki-kurokawa": true };
  if (person === CASE.answer.person && alibi === CASE.answer.alibi && method === CASE.answer.method) {
    return { closed: true, key: "ending" };
  }
  if (person === "aoki") return { closed: false, key: "aoki" };
  if (person === "kurokawa") return { closed: false, key: "kurokawa" };
  if (person === "akasaka") return { closed: false, key: "akasaka" };
  if (pairs[person]) return { closed: false, key: "pair" };
  if (person === "none" || method === "never") return { closed: false, key: "none" };
  if (person === "shiraishi" && method === "swap-2015") return { closed: false, key: "early" };
  if (person === "shiraishi" && alibi !== "shiraishi-front") return { closed: false, key: "door" };
  if (person === "shiraishi") return { closed: false, key: "papers" };
  return { closed: false, key: "remain" };
}

function renderResult(app) {
  var main = el("main", "sheet narrow");
  var key = state.result.key;
  var solved = state.result.closed || key === "ending" || key === "answer";
  main.appendChild(el("h1", "screen-title", key === "answer" ? "答え" : (solved ? "閉じました" : "まだ閉じません")));
  var card = el("div", solved ? "ending true" : "ending open");
  if (solved) {
    card.appendChild(summary("人", labelOf(CASE.charges.people, CASE.answer.person)));
    card.appendChild(summary("崩れる説明", labelOf(CASE.charges.alibis, CASE.answer.alibi)));
    card.appendChild(summary("手口", labelOf(CASE.charges.methods, CASE.answer.method)));
    paragraphs(card, CASE.ending);
  } else {
    card.appendChild(el("p", "", CASE.miss[key] || CASE.miss.remain));
  }
  main.appendChild(card);
  if (!solved && key !== "answer") {
    main.appendChild(btn("選び直す", function () {
      state.charge.step = 4;
      state.screen = "accuse";
      render();
    }, "primary"));
  }
  main.appendChild(btn("フロアへ戻る", function () { state.screen = "place"; render(); }, solved ? "primary" : "quiet-block"));
  app.appendChild(main);
}

function renderHint(app) {
  topbar(app);
  var main = el("main", "sheet narrow");
  main.appendChild(el("h1", "screen-title", "ヒント"));
  if (!state.hints) {
    main.appendChild(el("p", "lead", "ヒントは三つまでです。"));
  }
  for (var i = 0; i < state.hints; i += 1) {
    var block = el("div", "hint");
    block.appendChild(el("p", "summary-label", String(i + 1)));
    block.appendChild(el("p", "", CASE.hints[i]));
    main.appendChild(block);
  }
  if (state.hints < CASE.hints.length) {
    main.appendChild(btn(state.hints ? "次のヒント" : "一つ目を見る", function () {
      state.hints += 1;
      render();
    }, "primary"));
  }
  app.appendChild(main);
}

function renderConfirm(app) {
  var main = el("main", "sheet narrow");
  if (state.confirm === "answer") {
    main.appendChild(el("h1", "screen-title", "答えを見ます"));
    main.appendChild(el("p", "lead", "告発の前でも、三つの答えと、そのあとの文章を表示します。"));
    main.appendChild(btn("見る", revealAnswer, "primary"));
  } else {
    main.appendChild(el("h1", "screen-title", "最初から"));
    main.appendChild(el("p", "lead", "調べたもの、会話、メモ、ヒントを消します。"));
    main.appendChild(btn("消す", resetGame, "primary"));
  }
  main.appendChild(btn("やめる", cancelAsk, "quiet-block"));
  app.appendChild(main);
}

document.addEventListener("DOMContentLoaded", render);
