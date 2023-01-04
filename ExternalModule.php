<?php

namespace ADRCPipe\ExternalModule;

use ExternalModules\AbstractExternalModule;
use DataEntry;

class ExternalModule extends AbstractExternalModule {

  function redcap_data_entry_form_top($project_id, $record, $instrument, $event_id, $group_id, $repeat_instance) {
    // only spawn search interface on specified form
    if (!in_array($instrument, (array) $this->framework->getProjectSetting('show_on_form'))) return;

    // data is all processed in frontend for easier maintainability since more people seem to know JS
    $record_info = $this->getPersonInfo($record)[$record][$event_id];
    $this->setJsSettings([
      "record_info" => $record_info
    ]);

    $this->includeJs('js/fill_fields.js');
  }

  function getPersonInfo($record_id) {
    if (!$record_id) return false;

    $get_data = [
      'project_id' => $project_id,
      'records' => $record_id,
      //'events' => $event,
      'events' => 'participant_info'
      // 'fields' => $source_fields,
    ];

    $redcap_data = \REDCap::getData($get_data);

    return $redcap_data;
  }

  protected function includeJs($file) {
    echo '<script src="' . $this->getUrl($file) . '"></script>';
  }

  protected function setJsSettings($settings) {
    echo '<script>ADRCPipe = ' . json_encode($settings) . ';</script>';
  }
}
