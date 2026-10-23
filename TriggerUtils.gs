//============================================================
// Trigger management
//============================================================

function pasangTriggerOtomatis() {
  validateConfig();

  var managedFunctions = ["cekUptimeKeSheet", "cekLinkMatiKeSheet", "autoDeleteLog"];

  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    var handler = trigger.getHandlerFunction ? trigger.getHandlerFunction() : "";
    if (managedFunctions.indexOf(handler) !== -1) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger("cekUptimeKeSheet").timeBased().everyHours(6).create();
  ScriptApp.newTrigger("cekLinkMatiKeSheet").timeBased().everyDays(1).atHour(7).create();
  ScriptApp.newTrigger("autoDeleteLog").timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();
}
