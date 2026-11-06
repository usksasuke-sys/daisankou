"use strict";

var CASE = {
  title: "第三項",
  lead: "翌朝、シェアオフィスの金庫に、昨夜入れた合意書とは別の紙が入っていた。",
  groups: ["受付", "廊下", "会議室", "コピー室", "西バルコニー", "東階段", "話したこと"],
  hints: [
    "金庫が開いた時刻と、そのとき各人がどこにいたかを、別々に置いてください。",
    "カードの退室と、非常扉の開放は、別の記録です。正面の扉は、カードがないと内側からも開きません。",
    "金庫の中の三枚と、テーブルの下の四枚で、第3項と、紙の端の線を比べてください。"
  ],
  people: [
    { id: "mori", name: "森 栞", caption: "受付", place: "reception", root: "mori-root" },
    { id: "kurokawa", name: "黒川 誠", caption: "合意書の乙", place: "reception", root: "kurokawa-root" },
    { id: "shiraishi", name: "白石 透", caption: "行政書士", place: "meeting", root: "shiraishi-root" },
    { id: "aoki", name: "青木 蓮", caption: "合意書の甲", place: "copy", root: "aoki-root" },
    { id: "akasaka", name: "赤坂 萌", caption: "青木の同僚", place: "balcony", root: "akasaka-root" }
  ],
  places: [
    {
      id: "hall",
      name: "廊下",
      area: "hall",
      lead: "四階の廊下です。部屋の扉と、距離の書いてある案内があります。",
      spots: [
        {
          id: "distance",
          title: "距離の案内",
          note: "distance",
          body: [
            "壁の平面図に、赤い字で距離が書いてある。",
            "西バルコニーの扉から、会議室の入口まで、徒歩一分。",
            "コピー室と東階段は、廊下の角を挟む。注に、互いの部屋の中からは見えない、とある。"
          ]
        }
      ]
    },
    {
      id: "reception",
      name: "受付",
      area: "reception",
      lead: "カウンターの奥に森がいる。黒川は、来客用の椅子に座っている。棚に、昨夜のバインダーが残っている。",
      spots: [
        {
          id: "card-night",
          title: "昨夜のカード",
          kind: "record",
          note: "card-night",
          body: [
            "入退室の画面。枠は昨夜。",
            "入室 19:32 青木 蓮",
            "入室 19:34 赤坂 萌",
            "入室 19:36 黒川 誠",
            "入室 19:41 白石 透",
            "退室 20:48 黒川 誠",
            "退室 21:40 青木 蓮",
            "退室 21:41 赤坂 萌",
            "退室の行は、この三行です。"
          ]
        },
        {
          id: "card-morning",
          title: "今朝の入室",
          kind: "record",
          note: "card-morning",
          body: [
            "同じ機械の、別の枠。見出しは今朝。",
            "入室 7:50 黒川 誠",
            "入室 8:05 白石 透",
            "入室 8:10 青木 蓮",
            "入室 8:12 赤坂 萌",
            "昨夜の開閉とは、表が分かれています。"
          ]
        },
        {
          id: "phone-in",
          title: "内線",
          kind: "record",
          note: "phone-in",
          body: [
            "電話の内線ログ。枠は昨夜。",
            "21:18 発信 コピー室から受付の森",
            "21:36 終了",
            "保留 0",
            "ほかの内線は、この枠にありません。"
          ]
        },
        {
          id: "phone-out",
          title: "外線",
          kind: "record",
          note: "phone-out",
          body: [
            "外線のログ。枠は昨夜。",
            "青木、黒川、白石、赤坂のあいだの発信は、一件もない。",
            "四人のあいだの着信も、一件もない。",
            "受付が取りついだ夜の外線は、ゼロです。"
          ]
        },
        {
          id: "parking",
          title: "出庫のバインダー",
          kind: "record",
          note: "parking",
          body: [
            "駐車場の昨夜の頁。",
            "20:50 出庫 黒川 誠",
            "車両番号は、登録車と同じです。",
            "ETCの通過と、時刻は同じです。",
            "この頁に、徒歩で戻った行はありません。"
          ]
        },
        {
          id: "door-plate",
          title: "扉の札",
          note: "door-plate",
          body: [
            "正面の扉の横に、運用の札がある。",
            "カードをタッチすると、錠が開く。",
            "タッチがないと、内側からも開かない。",
            "記録が残らなかった場合、錠は開いていない。",
            "カードなしで外へ出られるのは、東の非常扉だけ。",
            "非常扉は、外からは開かない。"
          ]
        },
        {
          id: "door-log",
          title: "非常扉の記録",
          kind: "record",
          note: "door-log",
          body: [
            "扉の記録。正面のカードとは、別の表です。",
            "東の非常扉 21:31 内側から開放 一回",
            "そのあと、外からの開放はない。",
            "正面に、タッチのない開放はない。"
          ]
        },
        {
          id: "pin-book",
          title: "暗証の受領",
          kind: "record",
          note: "pin-book",
          body: [
            "金庫の暗証を渡した台帳。",
            "青木 蓮 署名あり",
            "白石 透 署名あり",
            "ほかの欄は、空欄です。",
            "欄外に、管理者の鍵は暗証とは別で、受付が保管、とある。"
          ]
        }
      ]
    },
    {
      id: "meeting",
      name: "会議室",
      area: "meeting",
      lead: "大きなテーブルと、奥の金庫です。白石が、テーブルのこちら側に座っています。",
      enter: { unlessSeen: "under-table", unlessHeard: "shiraishi-warn", node: "shiraishi-warn" },
      spots: [
        {
          id: "board",
          title: "ホワイトボード",
          note: "board",
          body: [
            "消されずに残っている。",
            "20:40 読み合わせ",
            "第3項 300万",
            "ほかの数字は、書いてありません。"
          ]
        },
        {
          id: "photo",
          title: "赤坂のタブレット",
          note: "photo",
          body: [
            "テーブルの端に、赤坂のタブレットがある。画面は、昨夜の写真で止まっている。",
            "ホワイトボードと、その左に、閉まった金庫が写っている。",
            "板の字は、20:40 読み合わせ。第3項 300万。",
            "画面に、撮影時刻は出ていません。"
          ]
        },
        {
          id: "safe-log",
          title: "金庫の履歴",
          kind: "record",
          note: "safe-log",
          body: [
            "金庫の横の画面は、上下に分かれている。",
            "昨夜 21:10 開 暗証一致",
            "昨夜 21:12 閉",
            "昨夜 21:29 開 暗証一致",
            "昨夜 21:29 閉",
            "失敗の入力は、昨夜ありません。",
            "今朝 8:20 管理者。下の行で、昨夜の二回とは分かれています。"
          ]
        },
        {
          id: "safe-papers",
          title: "金庫の中",
          note: "safe-papers",
          body: [
            "森が、確認のため今朝、管理者の鍵で開けている。",
            "中は三枚で、署名の頁はない。",
            "第3項の違約金は、30万。",
            "左の端に、上から下まで、薄い縦線がある。"
          ]
        },
        {
          id: "folder",
          title: "白石のフォルダ",
          note: "folder",
          body: [
            "テーブルの上に、白石の名のある紙のフォルダがある。",
            "中は三枚。署名の頁はない。",
            "第3項の違約金は、30万。",
            "左の端に、上から下まで、薄い縦線がある。"
          ]
        },
        {
          id: "notebook",
          title: "白石のノート",
          note: "notebook",
          body: [
            "椅子の上に、開いたノートがある。",
            "本文の字と、余白の字は、同じです。",
            "余白に、第3項の草案として、30万とある。",
            "その横に、300万のままだと、前回の説明と食い違う、と書いてある。"
          ]
        },
        {
          id: "under-table",
          title: "テーブルの下",
          note: "under-table",
          body: [
            "天板の裏に、テープで紙が留めてある。",
            "四枚ある。第3項の違約金は、300万。",
            "最後の頁に、青木、黒川、白石の署名がある。",
            "左の端に、縦線はない。"
          ]
        }
      ]
    },
    {
      id: "copy",
      name: "コピー室",
      area: "copy",
      lead: "複合機と、壁の受話器です。青木が、複合機の横に立っています。東の階段は、この部屋からは見えません。",
      spots: [
        {
          id: "copy-job",
          title: "ジョブ履歴",
          kind: "record",
          note: "copy-job",
          body: [
            "複合機の画面に、昨夜のジョブが残っている。",
            "20:15 白石 三ページ 二部",
            "この会議のあいだの、ほかのジョブは、残っていません。"
          ]
        },
        {
          id: "cord",
          title: "壁の受話器",
          note: "cord",
          body: [
            "受話器は、壁に固定されている。",
            "スピーカーには、切り替わらない。受話器を置くと、通話は切れる。",
            "コードを伸ばすと、コピー室の扉の枠までです。",
            "廊下へは出ません。会議室の金庫までは、届きません。"
          ]
        }
      ]
    },
    {
      id: "balcony",
      name: "西バルコニー",
      area: "balcony",
      lead: "西の端で、外の光が入っています。赤坂が、手すりに肘をついています。",
      spots: [
        {
          id: "camera",
          title: "カメラの再生",
          kind: "record",
          note: "camera",
          body: [
            "扉の横の画面で、昨夜のバルコニーが再生できる。",
            "20:55から21:33まで、赤坂が手すりのところにいる。",
            "21:33に、バルコニーの扉へ手を伸ばして、画面から出る。",
            "別の人が映るコマは、ありません。"
          ]
        },
        {
          id: "walk",
          title: "床の案内",
          note: "distance",
          body: [
            "扉の下の床に、案内が貼ってある。",
            "会議室の入口まで、徒歩一分。"
          ]
        }
      ]
    },
    {
      id: "stairs",
      name: "東階段",
      area: "stairs",
      lead: "東の非常扉です。人はいません。",
      spots: [
        {
          id: "emergency-door",
          title: "非常扉",
          note: "emergency-door",
          body: [
            "押し棒を押すと、外の階段へ出る。",
            "外がわに、カードの読み取り機はない。",
            "閉まった扉は、外からは押せない。",
            "札に、開放は受付の別記録に残る、とある。"
          ]
        }
      ]
    }
  ],
  notes: {
    "distance": { group: "廊下", text: "西バルコニーから会議室の入口まで徒歩一分。コピー室と東階段は、互いの部屋の中からは見えない。" },
    "card-night": { group: "受付", text: "昨夜のカード。入室は青木19:32、赤坂19:34、黒川19:36、白石19:41。退室は黒川20:48、青木21:40、赤坂21:41。" },
    "card-morning": { group: "受付", text: "今朝の入室は別枠。黒川7:50、白石8:05、青木8:10、赤坂8:12。" },
    "phone-in": { group: "受付", text: "内線は21:18から21:36、コピー室から森へ。保留はゼロ。ほかの内線は昨夜ない。" },
    "phone-out": { group: "受付", text: "昨夜、青木、黒川、白石、赤坂のあいだの外線は一件もない。" },
    "parking": { group: "受付", text: "20:50、黒川の車が出庫。登録車とETCの通過が、同じ時刻で一致している。" },
    "door-plate": { group: "受付", text: "正面はカードがないと内側からも開かない。記録が残らなければ錠は開いていない。カードなしで出られるのは東の非常扉だけで、外からは開かない。" },
    "door-log": { group: "受付", text: "東の非常扉は21:31に内側から一度開いている。そのあと外からは開いていない。正面にタッチのない開放はない。" },
    "pin-book": { group: "受付", text: "金庫の暗証の受領署名は、青木と白石だけである。" },
    "board": { group: "会議室", text: "ホワイトボードに、20:40 読み合わせ、と、第3項 300万、とある。" },
    "photo": { group: "会議室", text: "赤坂のタブレットの写真に、そのホワイトボードと、閉まった金庫が写っている。撮影時刻は画面に出ていない。" },
    "safe-log": { group: "会議室", text: "金庫の昨夜は、21:10開、21:12閉、21:29開、21:29閉。どちらも暗証が一致し、失敗はない。今朝8:20の管理者は別行。" },
    "safe-papers": { group: "会議室", text: "金庫の中は三枚、署名なし、第3項は30万。左端に薄い縦線がある。" },
    "folder": { group: "会議室", text: "白石のフォルダは三枚、署名なし、第3項は30万。左端に薄い縦線がある。" },
    "notebook": { group: "会議室", text: "白石のノートの余白に、草案の30万と、300万のままだと前回の説明と食い違う、と本文と同じ字である。" },
    "under-table": { group: "会議室", text: "テーブルの下に四枚。第3項は300万。最後の頁に青木、黒川、白石の署名。縦線はない。" },
    "copy-job": { group: "コピー室", text: "コピーのジョブは20:15、白石、三ページ、二部。" },
    "cord": { group: "コピー室", text: "コピー室の受話器は、置くと切れ、スピーカーにならない。コードは扉の枠までで、金庫には届かない。" },
    "camera": { group: "西バルコニー", text: "西バルコニーのカメラに、赤坂が20:55から21:33までいる。21:33に扉へ手を伸ばす。別の人は映っていない。" },
    "emergency-door": { group: "東階段", text: "東の非常扉は、内側から押すと外へ出る。外にカードの読み取り機はなく、閉まったあとは外から押せない。" },
    "shiraishi-warn": { group: "話したこと", text: "白石は、テーブルの下は見なくていい、昨日荷物を置いただけだ、と言った。" },
    "mori-ear": { group: "話したこと", text: "森は、21:18から21:36まで青木の声が近く、保留はなく、コピー機の音が続いていた、と言っている。" },
    "mori-not-see": { group: "話したこと", text: "森は、白石が正面を通るのは見ていない、と言っている。" },
    "mori-calls": { group: "話したこと", text: "森は、四人のあいだの外線は昨夜一件もなく、内線はコピー室から自分への一件だけだ、と言っている。" },
    "aoki-contents": { group: "話したこと", text: "青木は、21:10に第3項300万の署名済み四枚を入れ、21:12に閉め、白石も見ていた、と言っている。" },
    "aoki-phone-claim": { group: "話したこと", text: "青木は、21:18から21:36までコピー室で受話器を置かず、金庫は二度と開けていない、と言っている。" },
    "aoki-pin": { group: "話したこと", text: "青木は、暗証を教えたのは自分と白石だけで、赤坂と黒川には教えていない、と言っている。" },
    "aoki-loss": { group: "話したこと", text: "青木は、30万だと受け取る自分が損だ、と言っている。" },
    "kurokawa-left": { group: "話したこと", text: "黒川は、20:48に正面のカードで出て、20:50に自分の車で出た、と言っている。" },
    "kurokawa-pin": { group: "話したこと", text: "黒川は、暗証を知らず、金庫の前に立っていない、と言っている。" },
    "kurokawa-call": { group: "話したこと", text: "黒川は、夜に白石と電話していない、と言っている。" },
    "kurokawa-gain": { group: "話したこと", text: "黒川は、違約金を払うのは自分で、30万のほうが負担は小さい、と言っている。" },
    "akasaka-photo-claim": { group: "話したこと", text: "赤坂は、20:40に、第3項300万の板と閉まった金庫を撮った、と言っている。" },
    "akasaka-balcony-claim": { group: "話したこと", text: "赤坂は、カメラに映っているあいだ手すりにいて、扉へ手を伸ばした時刻は21:33だ、と言っている。" },
    "akasaka-return": { group: "話したこと", text: "赤坂は、戻ったとき会議室に人はおらず、白石とはすれ違わず、金庫は閉まり、コピー室に青木の声があった、と言っている。" },
    "akasaka-pin": { group: "話したこと", text: "赤坂は、暗証を聞いていない、と言っている。" },
    "shiraishi-left": { group: "話したこと", text: "白石は、21:30に正面から帰り、カードをタッチし忘れたかもしれない、と言っている。" },
    "shiraishi-saw": { group: "話したこと", text: "白石は、21:10に300万の署名済みを入れるところを見て、そのあと金庫には触れていない、と言っている。" },
    "shiraishi-deny-door": { group: "話したこと", text: "白石は、非常扉は知らず、あちらからは出ていない、と言っている。" },
    "shiraishi-deny-under": { group: "話したこと", text: "テーブルの下の四枚を見せると、白石は、今朝まで下を見ていない、誰が貼ったか知らない、と言った。" },
    "shiraishi-copy-claim": { group: "話したこと", text: "白石は、20:15に三枚を二部、確認で刷り、金庫には入れていない、と言っている。" },
    "shiraishi-2129-claim": { group: "話したこと", text: "21:29の開閉を伝えると、白石は、その時刻は正面へ歩いていて、金庫は開けていない、と言った。" },
    "shiraishi-pin": { group: "話したこと", text: "白石は、暗証を午前に青木から教わり、知るのは自分と青木だけだ、と言っている。" },
    "shiraishi-machine": { group: "話したこと", text: "扉の仕様を伝えると、白石は、タッチしたのに記録が落ちた、正面から出た、と言った。" },
    "shiraishi-deny-line": { group: "話したこと", text: "紙の端の線とジョブを伝えると、白石は、確認で刷った紙を金庫へは入れていない、と言った。" }
  },
  nodes: {
    "intro": {
      person: "mori",
      say: [
        "シェアオフィス四階です。昨夜、会議室を使ったのは四人です。",
        "借りている青木蓮さん。相手の黒川誠さん。行政書士の白石透さん。青木さんの同僚の赤坂萌さん。",
        "金庫に入れた合意書が、今朝は別の紙になっていました。署には出ていません。閉館まで、このフロアを見てください。"
      ],
      choices: [
        { label: "フロアを見る", exit: true }
      ]
    },
    "shiraishi-warn": {
      person: "shiraishi",
      note: "shiraishi-warn",
      say: [
        "あ、テーブルの下は、見なくていいです。",
        "昨日、荷物を置いただけなので。"
      ],
      choices: [
        { label: "部屋を見る", exit: true }
      ]
    },
    "mori-root": {
      person: "mori",
      say: ["受付の森です。棚の記録は、出してあります。"],
      choices: [
        { label: "内線のあいだ、何が聞こえましたか", next: "mori-call" },
        { label: "白石さんは正面を通りましたか", next: "mori-front" },
        { label: "昨夜の外線は", next: "mori-line" },
        { label: "暗証は誰が受け取りましたか", next: "mori-pin" },
        { label: "話を終える", exit: true }
      ]
    },
    "mori-call": {
      person: "mori",
      note: "mori-ear",
      say: [
        "21:18から21:36まで、青木さんがコピー室から切りませんでした。",
        "保留の音は、一度もありません。声は近くて、コピー機の低い音が、最後まで入っていました。"
      ],
      choices: [
        { label: "ほかを聞く", next: "mori-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "mori-front": {
      person: "mori",
      note: "mori-not-see",
      say: [
        "白石さんが正面を通るのは、見ていません。",
        "正面は、カードがないと開かない扉です。"
      ],
      choices: [
        { label: "ほかを聞く", next: "mori-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "mori-line": {
      person: "mori",
      note: "mori-calls",
      say: [
        "昨夜の外線で、四人のあいだをつないだものは、一件もありません。",
        "内線は、コピー室から私への一件だけです。"
      ],
      choices: [
        { label: "ほかを聞く", next: "mori-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "mori-pin": {
      person: "mori",
      say: [
        "受領簿は、棚にあります。",
        "署名は、青木さんと白石さんの二人です。管理者の鍵は別で、私が持っています。"
      ],
      choices: [
        { label: "ほかを聞く", next: "mori-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "aoki-root": {
      person: "aoki",
      say: ["青木です。金庫の件で、残っています。"],
      choices: [
        { label: "21:10に、何を入れましたか", next: "aoki-safe" },
        { label: "そのあと、どこにいましたか", next: "aoki-after" },
        { label: "暗証を知るのは誰ですか", next: "aoki-pin" },
        { label: "30万だと、誰が損ですか", next: "aoki-loss", need: "safe-papers" },
        { label: "話を終える", exit: true }
      ]
    },
    "aoki-safe": {
      person: "aoki",
      note: "aoki-contents",
      say: [
        "21:10に開けて、第3項が300万の、署名のある四枚を入れました。",
        "21:12に閉めています。白石さんも、横で見ていました。"
      ],
      choices: [
        { label: "ほかを聞く", next: "aoki-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "aoki-after": {
      person: "aoki",
      note: "aoki-phone-claim",
      say: [
        "そのあと、コピー室の電話です。",
        "21:18から21:36まで、森さんと空調の話をしました。受話器は置いていません。",
        "金庫は、二度と開けていません。"
      ],
      choices: [
        { label: "ほかを聞く", next: "aoki-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "aoki-pin": {
      person: "aoki",
      note: "aoki-pin",
      say: ["暗証を渡しているのは、私と白石さんだけです。赤坂と黒川には、教えていません。"],
      choices: [
        { label: "ほかを聞く", next: "aoki-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "aoki-loss": {
      person: "aoki",
      note: "aoki-loss",
      say: ["30万だと、受け取る側の私が損をします。そんな紙には、替えていません。"],
      choices: [
        { label: "ほかを聞く", next: "aoki-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "kurokawa-root": {
      person: "kurokawa",
      say: ["黒川です。呼ばれたので、来ました。"],
      choices: [
        { label: "いつ帰りましたか", next: "kurokawa-left" },
        { label: "暗証は知っていますか", next: "kurokawa-pin" },
        { label: "夜、白石さんと話しましたか", next: "kurokawa-call" },
        { label: "30万は、誰の負担ですか", next: "kurokawa-gain", need: "safe-papers" },
        { label: "話を終える", exit: true }
      ]
    },
    "kurokawa-left": {
      person: "kurokawa",
      note: "kurokawa-left",
      say: ["20:48に、正面のカードで出ました。20:50に、自分の車で駐車場を出ています。ETCのままです。"],
      choices: [
        { label: "ほかを聞く", next: "kurokawa-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "kurokawa-pin": {
      person: "kurokawa",
      note: "kurokawa-pin",
      say: ["暗証は知りません。金庫の前にも、立っていません。"],
      choices: [
        { label: "ほかを聞く", next: "kurokawa-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "kurokawa-call": {
      person: "kurokawa",
      note: "kurokawa-call",
      say: ["夜、白石さんとは電話していません。"],
      choices: [
        { label: "ほかを聞く", next: "kurokawa-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "kurokawa-gain": {
      person: "kurokawa",
      note: "kurokawa-gain",
      say: ["違約金を払うのは私です。30万のほうが、負担は小さい。替えたのではありません。"],
      choices: [
        { label: "ほかを聞く", next: "kurokawa-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "akasaka-root": {
      person: "akasaka",
      say: ["赤坂です。外の空気を、吸っていました。"],
      choices: [
        { label: "ホワイトボードの写真は", next: "akasaka-photo" },
        { label: "バルコニーには、いつまで", next: "akasaka-balcony" },
        { label: "戻ったとき、部屋は", next: "akasaka-return" },
        { label: "暗証は知っていますか", next: "akasaka-pin" },
        { label: "話を終える", exit: true }
      ]
    },
    "akasaka-photo": {
      person: "akasaka",
      note: "akasaka-photo-claim",
      say: [
        "20:40の読み合わせで、板を撮りました。",
        "第3項の300万と、閉まった金庫が、同じ画面に入っています。",
        "タブレットは、会議テーブルに置いたままです。"
      ],
      choices: [
        { label: "ほかを聞く", next: "akasaka-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "akasaka-balcony": {
      person: "akasaka",
      note: "akasaka-balcony-claim",
      say: [
        "20:55から、外にいました。",
        "画面に映っているあいだは、手すりのところです。",
        "扉へ手を伸ばしたとき、画面の時刻は21:33でした。"
      ],
      choices: [
        { label: "ほかを聞く", next: "akasaka-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "akasaka-return": {
      person: "akasaka",
      note: "akasaka-return",
      say: [
        "会議室に戻ったとき、人はいませんでした。白石さんとは、すれ違っていません。",
        "金庫は、閉まっていました。コピー室のほうで、青木さんの声がしていました。"
      ],
      choices: [
        { label: "ほかを聞く", next: "akasaka-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "akasaka-pin": {
      person: "akasaka",
      note: "akasaka-pin",
      say: ["暗証は、聞いていません。"],
      choices: [
        { label: "ほかを聞く", next: "akasaka-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "shiraishi-root": {
      person: "shiraishi",
      say: ["白石です。文案は、私が扱いました。"],
      choices: [
        { label: "いつ帰りましたか", next: "shiraishi-left" },
        { label: "金庫は見ましたか", next: "shiraishi-safe" },
        { label: "非常扉は", next: "shiraishi-door" },
        { label: "テーブルの下は", next: "shiraishi-table", unless: "under-table" },
        { label: "テーブルの下の四枚を見ました", next: "shiraishi-table-after", after: "under-table" },
        { label: "暗証は", next: "shiraishi-pin" },
        { label: "20:15の印刷は", next: "shiraishi-copy", need: "copy-job" },
        { label: "21:29にも開いています", next: "shiraishi-second", need: "safe-log" },
        { label: "正面は、カードがないと開きません", next: "shiraishi-challenge-door", need: "door-plate" },
        { label: "金庫の紙と、20:15のジョブを見ました", next: "shiraishi-line", needAll: ["safe-papers", "copy-job"] },
        { label: "話を終える", exit: true }
      ]
    },
    "shiraishi-left": {
      person: "shiraishi",
      note: "shiraishi-left",
      say: ["21:30です。正面から帰りました。カードは、タッチし忘れたかもしれません。"],
      choices: [
        { label: "ほかを聞く", next: "shiraishi-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "shiraishi-safe": {
      person: "shiraishi",
      note: "shiraishi-saw",
      say: [
        "21:10に、第3項が300万の署名済みを入れるところは、見ていました。",
        "そのあと、金庫には触れていません。"
      ],
      choices: [
        { label: "ほかを聞く", next: "shiraishi-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "shiraishi-door": {
      person: "shiraishi",
      note: "shiraishi-deny-door",
      say: ["非常扉は、知りません。あちらからは、出ていません。"],
      choices: [
        { label: "ほかを聞く", next: "shiraishi-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "shiraishi-table": {
      person: "shiraishi",
      note: "shiraishi-warn",
      say: ["下は、見なくていいです。昨日、荷物を置いただけです。"],
      choices: [
        { label: "ほかを聞く", next: "shiraishi-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "shiraishi-table-after": {
      person: "shiraishi",
      note: "shiraishi-deny-under",
      say: ["今朝まで、下は見ていません。誰が貼ったのかは、知りません。"],
      choices: [
        { label: "ほかを聞く", next: "shiraishi-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "shiraishi-pin": {
      person: "shiraishi",
      note: "shiraishi-pin",
      say: ["暗証は、午前に青木さんから教わりました。知っているのは、私と青木さんだけです。"],
      choices: [
        { label: "ほかを聞く", next: "shiraishi-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "shiraishi-copy": {
      person: "shiraishi",
      note: "shiraishi-copy-claim",
      say: ["20:15に、三枚を二部、確認で刷りました。会議の控えです。金庫には入れていません。"],
      choices: [
        { label: "ほかを聞く", next: "shiraishi-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "shiraishi-second": {
      person: "shiraishi",
      note: "shiraishi-2129-claim",
      say: ["その時刻は、正面へ歩いていました。金庫は開けていません。"],
      choices: [
        { label: "ほかを聞く", next: "shiraishi-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "shiraishi-challenge-door": {
      person: "shiraishi",
      note: "shiraishi-machine",
      say: ["タッチしたのに、記録が落ちたのでしょう。私は正面から出ました。"],
      choices: [
        { label: "ほかを聞く", next: "shiraishi-root" },
        { label: "話を終える", exit: true }
      ]
    },
    "shiraishi-line": {
      person: "shiraishi",
      note: "shiraishi-deny-line",
      say: ["確認で刷った紙が、金庫にあるはずがありません。私は入れていません。"],
      choices: [
        { label: "ほかを聞く", next: "shiraishi-root" },
        { label: "話を終える", exit: true }
      ]
    }
  },
  charges: {
    people: [
      { id: "aoki", label: "青木 蓮、一人" },
      { id: "kurokawa", label: "黒川 誠、一人" },
      { id: "shiraishi", label: "白石 透、一人" },
      { id: "akasaka", label: "赤坂 萌、一人" },
      { id: "aoki-shiraishi", label: "青木と白石" },
      { id: "kurokawa-shiraishi", label: "黒川と白石" },
      { id: "aoki-kurokawa", label: "青木と黒川" },
      { id: "none", label: "入れ替えた人はいない" }
    ],
    alibis: [
      { id: "aoki-phone", label: "青木は、通話のあいだコピー室にいて、金庫には触れていない" },
      { id: "kurokawa-out", label: "黒川は、20:50の出庫以降、建物の外にいた" },
      { id: "shiraishi-front", label: "白石は、21:30に正面の扉から帰り、カードをタッチし忘れただけ" },
      { id: "akasaka-balcony", label: "赤坂は、21:33までバルコニーにいて、会議室に戻ったのはそのあと" }
    ],
    methods: [
      { id: "aoki-before-exit", label: "青木が退室前に金庫を開け、30万の三枚と入れ替えた" },
      { id: "kurokawa-before-exit", label: "黒川が出庫前に、自分の負担が減る三枚へ入れ替えた" },
      { id: "swap-2129", label: "白石が21:29に金庫を開け、20:15に自分のアカウントで刷った第3項30万の三枚と入れ替え、署名済みの四枚を会議テーブルの下に隠し、東の非常扉から出た" },
      { id: "swap-2015", label: "白石が20:15に刷ったとき入れ替えを終え、夜は非常扉から出ただけ" },
      { id: "akasaka-hide", label: "赤坂がバルコニーへ出る前に、四枚をテーブルの下へ移した" },
      { id: "never", label: "誰も入れ替えていない。三枚は最初から金庫の中だった" }
    ]
  },
  answer: { person: "shiraishi", alibi: "shiraishi-front", method: "swap-2129" },
  miss: {
    aoki: "21:18から21:36まで、青木はコピー室の受話器を置いていません。コードは金庫まで届きません。30万は、青木が受け取る違約金を減らします。",
    kurokawa: "20:50の出庫は、ETCと一致しています。黒川は暗証を知りません。東の非常扉は、外からは開きません。",
    akasaka: "赤坂は21:33まで西のバルコニーに映っています。そこから会議室までは徒歩一分です。暗証は知りません。",
    pair: "夜の外線に、選んだ二人をつなぐ記録がありません。",
    none: "金庫は21:10のあと、21:29にもう一度開いています。署名のある四枚は、テーブルの下にあります。",
    early: "21:10に、署名済みの300万が金庫へ入っています。20:15の印刷は、そのあと中身が30万へ変わることを説明していません。",
    door: "白石のカードに、退室はありません。正面の扉は、カードがないと内側からも開きません。",
    papers: "開いたのは21:29です。テーブルの下の四枚と、30万の紙の端の線が、この手口では揃いません。",
    remain: "時刻と、扉と、紙の三つのうち、まだ揃っていないものがあります。"
  },
  ending: [
    "金庫が開いたのは、21:10と21:29です。21:10に入ったのは、第3項が300万の、署名のある四枚です。青木も白石も、それを見ています。翌朝の金庫の中は、署名のない三枚で、第3項は30万です。入れ替えは、21:29です。",
    "21:29に、青木はコピー室の受話器を置いていません。21:18から21:36まで森と話し、保留はなく、声とコピー機の音が近くで続いています。コードは金庫まで届きません。赤坂は21:33まで西のバルコニーに映っていて、会議室へ戻るのは徒歩一分あとです。黒川は20:50の出庫以降、外にいます。暗証の受領は、青木と白石だけです。21:29に金庫を開けられるのは、白石一人です。",
    "金庫の三枚と、白石のフォルダの三枚は、左端の縦線が同じです。コピー室の20:15のジョブは、白石、三ページ、二部です。テーブルの下の四枚は、縦線がなく、第3項は300万で、三人の署名があります。",
    "白石のカードに退室はありません。正面の扉は、カードがないと内側からも開きません。カードなしで出られるのは東の非常扉だけで、21:31に一度開いています。外からは戻れません。署名済みの四枚は、テーブルの下に残ったままです。",
    "30万は黒川の負担を減らし、青木の受け取りを減らします。夜の外線に、黒川と白石をつなぐ記録はありません。白石のノートの余白には、30万の草案と、300万のままだと前回の説明と食い違う、と自分の字で残っています。"
  ]
};
