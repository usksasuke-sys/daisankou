"use strict";

var KEY = "daisankou-desk";
var FILE_IDS = [
  "card-night", "card-morning", "phone-in", "phone-out", "parking",
  "door-plate", "door-log", "pin-book", "safe-log", "copy-job", "camera"
];

var state = load();

function fresh() {
  return {
    started: false,
    admin: false,
    openedFloor: false,
    view: "reception",
    viewId: "",
    node: "",
    place: "reception",
    seen: {},
    heard: {},
    notes: [],
    memo: "",
    hints: 0,
    charge: { step: 1, person: "", alibi: "", method: "" },
    solved: false,
    revealed: false,
    result: { closed: false, key: "" }
  };
}

function load() {
  var next = fresh();
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || "");
    if (!saved || !saved.seen || !saved.heard) return next;
    ["started", "admin", "openedFloor", "view", "viewId", "node", "place", "memo", "hints", "solved", "revealed"].forEach(function (key) {
      if (saved[key] !== undefined && saved[key] !== null) next[key] = saved[key];
    });
    next.seen = saved.seen;
    next.heard = saved.heard;
    next.notes = saved.notes || [];
    next.charge = saved.charge || next.charge;
    next.result = saved.result || next.result;
    if (!placeById(next.place)) next.place = "reception";
  } catch (error) {
    return fresh();
  }
  return next;
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (error) {}
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

function labelOf(list, id) {
  for (var i = 0; i < list.length; i += 1) {
    if (list[i].id === id) return list[i].label;
  }
  return "";
}

function hasFact(id) {
  return !!(state.seen[id] || state.heard[id]);
}

function kept(id) {
  return !!(id && state.notes.indexOf(id) !== -1);
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

function roomSpots(place) {
  return (place.spots || []).filter(function (spot) {
    return FILE_IDS.indexOf(spot.id) === -1;
  });
}

function el(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function btn(text, className, onClick) {
  var button = el("button", className || "", text);
  button.type = "button";
  button.addEventListener("click", onClick);
  return button;
}

function paragraphs(parent, lines) {
  lines.forEach(function (line) {
    parent.appendChild(el("p", "", line));
  });
}

function paper() {
  return el("article", "paper");
}

function render() {
  save();
  document.getElementById("title").hidden = state.started;
  document.getElementById("app").hidden = !state.started;
  document.getElementById("go-solution").hidden = !state.admin;
  if (!state.started) {
    document.getElementById("title-lead").textContent = CASE.lead;
    return;
  }
  renderRoster();
  renderStage();
  renderNotes();
}

function renderRoster() {
  var roster = document.getElementById("roster");
  roster.innerHTML = "";
  roster.appendChild(el("h2", "", "話を聞ける人"));
  CASE.people.forEach(function (person) {
    var place = placeById(person.place);
    var button = btn("", "person-btn" + (state.view === "person" && state.viewId === person.id ? " on" : ""), function () {
      openPerson(person.id);
    });
    button.appendChild(el("span", "", person.name));
    button.appendChild(el("small", "", person.caption + "・" + (place ? place.name : "")));
    roster.appendChild(button);
  });
}

function renderStage() {
  var stage = document.getElementById("stage");
  stage.innerHTML = "";
  if (state.view === "floor") stage.appendChild(renderFloor());
  else if (state.view === "room") stage.appendChild(renderRoom());
  else if (state.view === "spot") stage.appendChild(renderSpot());
  else if (state.view === "files") stage.appendChild(renderFiles());
  else if (state.view === "file") stage.appendChild(renderFile());
  else if (state.view === "person") stage.appendChild(renderPerson());
  else if (state.view === "hint") stage.appendChild(renderHint());
  else if (state.view === "charge") stage.appendChild(renderCharge());
  else if (state.view === "result") stage.appendChild(renderResult());
  else if (state.view === "confirm") stage.appendChild(renderConfirm());
  else stage.appendChild(renderReception());
}

function renderReception() {
  var box = paper();
  var intro = CASE.nodes.intro;
  box.appendChild(el("h2", "", "受付"));
  if (!state.openedFloor) {
    paragraphs(box, intro.say);
    box.appendChild(btn("フロアへ", "primary", openFloor));
  } else {
    var place = placeById("reception");
    paragraphs(box, [place.lead, "棚の記録は、資料にまとめてあります。"]);
    box.appendChild(btn("資料を開く", "primary", function () { setView("files"); }));
  }
  return box;
}

function renderFloor() {
  var box = paper();
  box.appendChild(el("h2", "", "フロア"));
  box.appendChild(el("p", "map-note", "西バルコニーから会議室の入口まで、徒歩一分。正面の入口は受付です。"));
  var map = el("div", "floor");
  CASE.places.forEach(function (place) {
    var button = btn(place.name, "room-btn room-" + place.area + (state.place === place.id ? " on" : ""), function () {
      openRoom(place.id);
    });
    map.appendChild(button);
  });
  box.appendChild(map);
  return box;
}

function renderRoom() {
  var place = placeById(state.viewId) || placeById("hall");
  var box = paper();
  box.appendChild(el("h2", "", place.name));
  box.appendChild(el("p", "", place.lead));
  var spots = roomSpots(place);
  if (!spots.length) {
    box.appendChild(el("p", "", "この部屋の記録は、資料にあります。"));
    box.appendChild(btn("資料を開く", "primary", function () { setView("files"); }));
  }
  spots.forEach(function (spot) {
    var button = btn(spot.title + (state.seen[spot.id] ? "　見た" : ""), "spot-btn", function () {
      openSpot(spot.id);
    });
    box.appendChild(button);
  });
  box.appendChild(btn("見取り図へ", "quiet", function () { setView("floor"); }));
  return box;
}

function renderSpot() {
  var spot = spotById(state.viewId);
  var box = paper();
  if (!spot) return box;
  state.seen[spot.id] = true;
  box.appendChild(el("p", "role", "調べる"));
  box.appendChild(el("h2", "", spot.title));
  var body = el("div", spot.kind === "record" ? "record" : "");
  paragraphs(body, spot.body);
  box.appendChild(body);
  box.appendChild(keepButton(spot.note));
  box.appendChild(btn("部屋へ戻る", "quiet", function () {
    state.view = "room";
    state.viewId = state.place;
    render();
  }));
  return box;
}

function renderFiles() {
  var box = paper();
  box.appendChild(el("h2", "", "資料"));
  box.appendChild(el("p", "", "昨夜と今朝の記録です。一枚ずつ開いてください。"));
  FILE_IDS.forEach(function (id) {
    var spot = spotById(id);
    if (!spot) return;
    box.appendChild(btn(spot.title + (state.seen[id] ? "　見た" : ""), "file-btn" + (state.viewId === id ? " on" : ""), function () {
      openFile(id);
    }));
  });
  return box;
}

function renderFile() {
  var spot = spotById(state.viewId);
  var box = paper();
  if (!spot) return box;
  state.seen[spot.id] = true;
  box.appendChild(el("p", "role", "資料"));
  box.appendChild(el("h2", "", spot.title));
  var body = el("div", "record");
  paragraphs(body, spot.body);
  box.appendChild(body);
  box.appendChild(keepButton(spot.note));
  box.appendChild(btn("資料の一覧へ", "quiet", function () { setView("files"); }));
  return box;
}

function renderPerson() {
  var node = CASE.nodes[state.node];
  var person = personById(state.viewId) || (node && personById(node.person));
  var box = paper();
  if (!node || !person) return box;
  state.heard[state.node] = true;
  box.appendChild(el("p", "role", person.caption));
  box.appendChild(el("h2", "", person.name));
  var said = el("div", "said");
  paragraphs(said, node.say);
  box.appendChild(said);
  if (node.note) box.appendChild(keepButton(node.note, "この話をメモに残す"));
  visibleChoices(node).forEach(function (choice) {
    box.appendChild(btn(choice.label, "choice", function () {
      if (choice.exit) closeTalk();
      else if (choice.next) showNode(choice.next);
    }));
  });
  return box;
}

function renderHint() {
  var box = paper();
  box.appendChild(el("h2", "", "ヒント"));
  if (!state.hints) box.appendChild(el("p", "", "ヒントは三つまでです。"));
  for (var i = 0; i < state.hints; i += 1) {
    var block = el("div", "hint");
    block.appendChild(el("p", "summary-label", String(i + 1)));
    block.appendChild(el("p", "", CASE.hints[i]));
    box.appendChild(block);
  }
  if (state.hints < CASE.hints.length) {
    box.appendChild(btn(state.hints ? "次のヒント" : "一つ目を見る", "primary", function () {
      state.hints += 1;
      render();
    }));
  }
  return box;
}

function renderCharge() {
  var box = paper();
  var charge = state.charge;
  box.appendChild(el("p", "role", "告発"));
  if (charge.step === 1) {
    box.appendChild(el("h2", "", "誰が入れ替えましたか"));
    choiceList(box, CASE.charges.people, charge.person, function (id) {
      charge.person = id;
      charge.step = 2;
      render();
    });
  } else if (charge.step === 2) {
    box.appendChild(el("h2", "", "崩れる説明はどれですか"));
    box.appendChild(el("p", "", "記録と合わない説明を選んでください。"));
    choiceList(box, CASE.charges.alibis, charge.alibi, function (id) {
      charge.alibi = id;
      charge.step = 3;
      render();
    });
  } else if (charge.step === 3) {
    box.appendChild(el("h2", "", "手口はどれですか"));
    choiceList(box, CASE.charges.methods, charge.method, function (id) {
      charge.method = id;
      charge.step = 4;
      render();
    });
  } else {
    box.appendChild(el("h2", "", "この読みで告発します"));
    box.appendChild(summary("人", labelOf(CASE.charges.people, charge.person)));
    box.appendChild(summary("崩れる説明", labelOf(CASE.charges.alibis, charge.alibi)));
    box.appendChild(summary("手口", labelOf(CASE.charges.methods, charge.method)));
    box.appendChild(btn("告発する", "primary", submitCharge));
  }
  if (charge.step > 1) {
    box.appendChild(btn("一つ戻る", "quiet", function () {
      charge.step -= 1;
      render();
    }));
  }
  return box;
}

function renderResult() {
  var box = paper();
  var key = state.result.key;
  var solved = state.result.closed || key === "ending" || key === "answer";
  box.appendChild(el("h2", "", key === "answer" ? "答え" : (solved ? "閉じました" : "まだ閉じません")));
  var card = el("div", solved ? "ending true" : "ending open");
  if (solved) {
    card.appendChild(summary("人", labelOf(CASE.charges.people, CASE.answer.person)));
    card.appendChild(summary("崩れる説明", labelOf(CASE.charges.alibis, CASE.answer.alibi)));
    card.appendChild(summary("手口", labelOf(CASE.charges.methods, CASE.answer.method)));
    paragraphs(card, CASE.ending);
  } else {
    card.appendChild(el("p", "", CASE.miss[key] || CASE.miss.remain));
  }
  box.appendChild(card);
  if (!solved && key !== "answer") {
    box.appendChild(btn("選び直す", "primary", function () {
      state.charge.step = 4;
      setView("charge");
    }));
  }
  return box;
}

function renderConfirm() {
  var box = paper();
  box.appendChild(el("h2", "", "最初から"));
  box.appendChild(el("p", "", "調べたもの、会話、メモ、ヒントを消します。"));
  box.appendChild(btn("消す", "primary", resetGame));
  box.appendChild(btn("やめる", "quiet", function () { setView(state.openedFloor ? "floor" : "reception"); }));
  return box;
}

function renderNotes() {
  var notes = document.getElementById("notes");
  var memoValue = state.memo;
  notes.innerHTML = "";
  notes.appendChild(el("h2", "", "メモ"));
  if (!state.notes.length) notes.appendChild(el("p", "empty", "まだ何も残していません。"));
  CASE.groups.forEach(function (group) {
    var items = state.notes.filter(function (id) {
      return CASE.notes[id] && CASE.notes[id].group === group;
    });
    if (!items.length) return;
    notes.appendChild(el("p", "group-label", group));
    var list = el("ul", "");
    items.forEach(function (id) {
      list.appendChild(el("li", "", CASE.notes[id].text));
    });
    notes.appendChild(list);
  });
  var label = el("label", "memo-label", "自分のメモ");
  label.setAttribute("for", "memo");
  notes.appendChild(label);
  var memo = el("textarea");
  memo.id = "memo";
  memo.value = memoValue;
  memo.placeholder = "気づいたことを書けます";
  memo.addEventListener("input", function () {
    state.memo = memo.value;
    save();
  });
  notes.appendChild(memo);
}

function summary(label, text) {
  var wrap = el("div", "summary");
  wrap.appendChild(el("p", "summary-label", label));
  wrap.appendChild(el("p", "", text));
  return wrap;
}

function choiceList(parent, list, selected, onPick) {
  list.forEach(function (item) {
    var button = btn(item.label, "choice" + (item.id === selected ? " on" : ""), function () { onPick(item.id); });
    parent.appendChild(button);
  });
}

function keepButton(noteId, label) {
  if (!noteId) return el("span", "");
  if (kept(noteId)) return el("p", "kept", "メモに残してあります。");
  return btn(label || "メモに残す", "keep", function () {
    if (state.notes.indexOf(noteId) === -1) state.notes.push(noteId);
    render();
  });
}

function setView(view, id) {
  state.view = view;
  if (id !== undefined) state.viewId = id;
  render();
}

function openFloor() {
  state.openedFloor = true;
  state.view = "floor";
  state.viewId = "";
  render();
}

function openRoom(id) {
  var place = placeById(id);
  state.place = id;
  var enter = place && place.enter;
  if (enter && !state.seen[enter.unlessSeen] && !state.heard[enter.unlessHeard]) {
    showNode(enter.node);
    return;
  }
  state.view = "room";
  state.viewId = id;
  render();
}

function openSpot(id) {
  var spot = spotById(id);
  if (!spot) return;
  state.seen[id] = true;
  state.view = "spot";
  state.viewId = id;
  render();
}

function openFile(id) {
  state.seen[id] = true;
  state.view = "file";
  state.viewId = id;
  render();
}

function openPerson(id) {
  var person = personById(id);
  if (!person) return;
  showNode(person.root);
}

function showNode(id) {
  var node = CASE.nodes[id];
  if (!node) {
    setView("floor");
    return;
  }
  state.node = id;
  state.view = "person";
  state.viewId = node.person;
  state.heard[id] = true;
  render();
}

function closeTalk() {
  var person = personById(state.viewId);
  var placeId = person ? person.place : state.place;
  state.node = "";
  openRoom(placeId);
}

function submitCharge() {
  var judged = judge(state.charge.person, state.charge.alibi, state.charge.method);
  state.result = { closed: judged.closed, key: judged.key };
  if (judged.closed) state.solved = true;
  setView("result");
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

function resetGame() {
  var admin = state.admin;
  localStorage.removeItem(KEY);
  state = fresh();
  state.admin = admin;
  render();
}

function startGame() {
  state.started = true;
  state.admin = !!document.getElementById("admin-mode").checked;
  state.view = "reception";
  render();
}

document.getElementById("start").addEventListener("click", startGame);
document.getElementById("go-reception").addEventListener("click", function () { setView("reception"); });
document.getElementById("go-floor").addEventListener("click", openFloor);
document.getElementById("go-files").addEventListener("click", function () { setView("files"); });
document.getElementById("go-hint").addEventListener("click", function () { setView("hint"); });
document.getElementById("go-charge").addEventListener("click", function () {
  state.charge = { step: 1, person: "", alibi: "", method: "" };
  setView("charge");
});
document.getElementById("go-solution").addEventListener("click", function () {
  state.revealed = true;
  state.result = { closed: false, key: "answer" };
  setView("result");
});
document.getElementById("go-reset").addEventListener("click", function () { setView("confirm"); });

document.addEventListener("DOMContentLoaded", render);
