'use strict';
// Translations for the admin donation page only, loaded after i18n-messages.js and before i18n.js.
// Kept apart from public-messages.js so short words here never rewrite text in the main app.
// Locale order: en, fr, es, it, pt, de, ko. Source keys are Japanese.
(function(){
 const messages={
  "寄付と資料の管理 — CHUCK":["Donations and documents — CHUCK", "Dons et documents — CHUCK", "Donaciones y documentos — CHUCK", "Donazioni e documenti — CHUCK", "Doações e documentos — CHUCK", "Spenden und Unterlagen — CHUCK", "후원 및 자료 관리 — CHUCK"],
  "CHUCK 管理":["CHUCK admin", "Administration CHUCK", "Administración de CHUCK", "Amministrazione CHUCK", "Administração do CHUCK", "CHUCK-Verwaltung", "CHUCK 관리"],
  "アプリに戻る":["Back to the app", "Retour à l'application", "Volver a la aplicación", "Torna all'app", "Voltar ao aplicativo", "Zurück zur App", "앱으로 돌아가기"],
  "アンテナ資料":["Antenna documents", "Documents d'antenne", "Documentos de antenas", "Documenti delle antenne", "Documentos de antenas", "Antennenunterlagen", "안테나 자료"],
  "「スポンサー」はそのユーザー名のスポンサー状況です（「記録なし」はそのユーザー名のスポンサー記録がないもの）。登録したら、アンテナ画面で作成したプリセットのIDを入れて「登録済み」にします。見送る場合は「見送り」にします。":["\"Sponsor\" shows the sponsorship status of that username (\"No record\" means no sponsorship is recorded for it). After registering, enter the ID of the preset created on the antenna screen and set \"Registered\". To pass, set \"Declined\".", "« Sponsor » indique le statut de parrainage de ce nom d'utilisateur (« Aucun enregistrement » signifie qu'aucun parrainage n'est enregistré). Après l'ajout, saisissez l'ID du préréglage créé dans l'écran des antennes et choisissez « Enregistré ». Pour ne pas donner suite, choisissez « Refusé ».", "«Patrocinador» muestra el estado de patrocinio de ese usuario («Sin registro» significa que no hay patrocinio registrado). Tras registrarla, introduzca el ID del preajuste creado en la pantalla de antenas y marque «Registrado». Para descartarla, marque «Descartado».", "«Sponsor» indica lo stato di sponsorizzazione di quel nome utente («Nessun record» significa che non risulta alcuna sponsorizzazione). Dopo la registrazione, inserisci l'ID del preset creato nella schermata delle antenne e imposta «Registrato». Per scartarla, imposta «Rifiutato».", "\"Patrocinador\" mostra a situação de patrocínio desse usuário (\"Sem registro\" significa que não há patrocínio registrado). Depois de registrar, informe o ID da predefinição criada na tela de antenas e marque \"Registrado\". Para descartar, marque \"Recusado\".", "„Sponsor“ zeigt den Sponsoring-Status dieses Benutzernamens („Kein Eintrag“ heißt, dass kein Sponsoring erfasst ist). Nach der Registrierung die ID der im Antennenbildschirm angelegten Vorlage eintragen und „Registriert“ wählen. Zum Ablehnen „Abgelehnt“ wählen.", "'스폰서'는 해당 사용자 이름의 후원 상태입니다('기록 없음'은 후원 기록이 없다는 뜻입니다). 등록했으면 안테나 화면에서 만든 프리셋 ID를 입력하고 '등록 완료'로 바꿉니다. 보류하려면 '보류'로 바꿉니다."],
  "スポンサー":["Sponsor", "Sponsor", "Patrocinador", "Sponsor", "Patrocinador", "Sponsor", "스폰서"],
  "GitHubで公開を選んだスポンサーだけが公開サイトの支援者一覧に載ります。非表示にすると一覧から外します。":["Only sponsors who chose public on GitHub appear in the supporter list on the public site. Hiding removes them from the list.", "Seuls les sponsors ayant choisi « public » sur GitHub figurent dans la liste des soutiens du site public. Masquer les retire de la liste.", "Solo los patrocinadores que eligieron «público» en GitHub aparecen en la lista de apoyos del sitio público. Ocultar los quita de la lista.", "Solo gli sponsor che hanno scelto «pubblico» su GitHub compaiono nell'elenco dei sostenitori del sito pubblico. Nascondere li rimuove dall'elenco.", "Só os patrocinadores que escolheram \"público\" no GitHub aparecem na lista de apoiadores do site público. Ocultar os remove da lista.", "Nur Sponsoren, die auf GitHub „öffentlich“ gewählt haben, erscheinen in der Unterstützerliste der öffentlichen Seite. Ausblenden entfernt sie aus der Liste.", "GitHub에서 공개를 선택한 스폰서만 공개 사이트의 후원자 목록에 표시됩니다. 숨기면 목록에서 빠집니다."],
  "最近の通知":["Recent notifications", "Notifications récentes", "Notificaciones recientes", "Notifiche recenti", "Notificações recentes", "Letzte Benachrichtigungen", "최근 알림"],
  "未処理":["Pending", "En attente", "Pendiente", "In attesa", "Pendente", "Offen", "미처리"],
  "登録済み":["Registered", "Enregistré", "Registrado", "Registrato", "Registrado", "Registriert", "등록 완료"],
  "見送り":["Declined", "Refusé", "Descartado", "Rifiutato", "Recusado", "Abgelehnt", "보류"],
  "失敗しました":["Failed", "Échec", "Error", "Operazione non riuscita", "Falhou", "Fehlgeschlagen", "실패했습니다"],
  "まだありません":["Nothing yet", "Rien pour l'instant", "Todavía no hay nada", "Ancora niente", "Ainda não há nada", "Noch nichts vorhanden", "아직 없습니다"],
  "継続中":["Active", "Actif", "Activo", "Attivo", "Ativo", "Aktiv", "후원 중"],
  "解約予定":["Ending", "Fin prévue", "Por cancelar", "In chiusura", "Cancelamento agendado", "Endet", "해지 예정"],
  "解約済み":["Cancelled", "Annulé", "Cancelado", "Annullato", "Cancelado", "Beendet", "해지됨"],
  "1回のみ":["One-time", "Ponctuel", "Única", "Una tantum", "Única", "Einmalig", "1회"],
  "毎月":["Monthly", "Mensuel", "Mensual", "Mensile", "Mensal", "Monatlich", "매월"],
  "スポンサー（{month}の見込み：毎月 {monthly}＋1回のみ {once}、手数料なし・入金はGitHubの明細で確認）":["Sponsors (expected for {month}: monthly {monthly} + one-time {once}; no fees, check payouts in GitHub)", "Sponsors (prévu pour {month} : mensuel {monthly} + ponctuel {once} ; sans frais, versements à vérifier sur GitHub)", "Patrocinadores (previsto para {month}: mensual {monthly} + única {once}; sin comisiones, pagos en GitHub)", "Sponsor (previsto per {month}: mensile {monthly} + una tantum {once}; nessuna commissione, pagamenti su GitHub)", "Patrocinadores (previsto para {month}: mensal {monthly} + única {once}; sem taxas, pagamentos no GitHub)", "Sponsoren (erwartet für {month}: monatlich {monthly} + einmalig {once}; keine Gebühren, Auszahlungen auf GitHub prüfen)", "스폰서({month} 예상: 매월 {monthly} + 1회 {once}, 수수료 없음, 입금은 GitHub 내역에서 확인)"],
  "運営費の目安：{goal}（固定額 {fixed}＋サーバーの請求額 {bill}、{time}更新）":["Running cost target: {goal} (fixed {fixed} + server bill {bill}, updated {time})", "Objectif des frais : {goal} (fixe {fixed} + facture du serveur {bill}, mis à jour {time})", "Objetivo de costes: {goal} (fijo {fixed} + factura del servidor {bill}, actualizado {time})", "Obiettivo dei costi: {goal} (fisso {fixed} + fattura del server {bill}, aggiornato {time})", "Meta de custos: {goal} (fixo {fixed} + fatura do servidor {bill}, atualizado {time})", "Kostenziel: {goal} (fest {fixed} + Serverrechnung {bill}, aktualisiert {time})", "운영비 목표: {goal}(고정 {fixed} + 서버 청구액 {bill}, {time} 업데이트)"],
  "運営費の目安：{goal}（固定額のみ、サーバーの請求額はまだ届いていません）":["Running cost target: {goal} (fixed amount only; no server bill received yet)", "Objectif des frais : {goal} (montant fixe uniquement ; aucune facture du serveur reçue)", "Objetivo de costes: {goal} (solo importe fijo; aún no se ha recibido la factura del servidor)", "Obiettivo dei costi: {goal} (solo importo fisso; nessuna fattura del server ricevuta)", "Meta de custos: {goal} (somente valor fixo; nenhuma fatura do servidor recebida)", "Kostenziel: {goal} (nur Festbetrag; noch keine Serverrechnung erhalten)", "운영비 목표: {goal}(고정액만, 서버 청구액은 아직 없음)"],
  "開始日時":["Started", "Début", "Inicio", "Inizio", "Início", "Beginn", "시작 일시"],
  "金額":["Amount", "Montant", "Importe", "Importo", "Valor", "Betrag", "금액"],
  "種類":["Type", "Type", "Tipo", "Tipo", "Tipo", "Art", "종류"],
  "公開":["Public", "Public", "Público", "Pubblico", "Público", "Öffentlich", "공개"],
  "一覧":["List", "Liste", "Lista", "Elenco", "Lista", "Liste", "목록"],
  "非公開":["Private", "Privé", "Privado", "Privato", "Privado", "Privat", "비공개"],
  "非表示":["Hidden", "Masqué", "Oculto", "Nascosto", "Oculto", "Ausgeblendet", "숨김"],
  "表示中":["Shown", "Affiché", "Visible", "Visibile", "Visível", "Sichtbar", "표시 중"],
  "表示する":["Show", "Afficher", "Mostrar", "Mostra", "Mostrar", "Anzeigen", "표시"],
  "非表示にする":["Hide", "Masquer", "Ocultar", "Nascondi", "Ocultar", "Ausblenden", "숨기기"],
  "受信日時":["Received", "Reçu le", "Recibido", "Ricevuto", "Recebido", "Empfangen", "수신 일시"],
  "操作":["Action", "Action", "Acción", "Azione", "Ação", "Aktion", "동작"],
  "受付日時":["Submitted", "Envoyé le", "Enviado", "Inviato", "Enviado", "Eingereicht", "접수 일시"],
  "メモ":["Note", "Note", "Nota", "Nota", "Nota", "Notiz", "메모"],
  "連絡先":["Contact", "Contact", "Contacto", "Contatto", "Contato", "Kontakt", "연락처"],
  "資料":["Document", "Document", "Documento", "Documento", "Documento", "Unterlage", "자료"],
  "プリセットID":["Preset ID", "ID du préréglage", "ID del preajuste", "ID del preset", "ID da predefinição", "Vorlagen-ID", "프리셋 ID"],
  "管理メモ":["Admin note", "Note d'administration", "Nota de administración", "Nota amministrativa", "Nota do administrador", "Verwaltungsnotiz", "관리 메모"],
  "記録なし":["No record", "Aucun enregistrement", "Sin registro", "Nessun record", "Sem registro", "Kein Eintrag", "기록 없음"],
  "保存しました":["Saved", "Enregistré", "Guardado", "Salvato", "Salvo", "Gespeichert", "저장했습니다"]
 };
 for(const [key,values]of Object.entries(messages))if(!(key in HF_MESSAGES))HF_MESSAGES[key]=values;
})();
