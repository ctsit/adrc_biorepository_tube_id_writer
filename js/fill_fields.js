$(document).ready(function() {
  main();
});

function main() {
  let participant_info_data = formatData(ADRCPipe["record_info"]);

  const sample_metadata = {
    "plasma_total": {"code": "P", "volume": 500},
    "serum_total": {"code": "S", "volume": 500},
    "buffy_coat_total": {"code": "BC"},
    "paxgene_total": {"code": "PG"}
  }

  let tube_num = 0;

  // array used to force reliable ordinal processing
  const sample_types = ["plasma_total", "serum_total", "buffy_coat_total", "paxgene_total"];

  sample_types.forEach(
    (sample_type) => {
      for (let i = 0; i < participant_info_data[sample_type].length; i++) {
        let entry = participant_info_data[sample_type][i];
        tube_num++;

        // TODO: alert user if tube_id_field does not exist (i.e. tube_id_field)
        // bug admin to make more fields
        let tube_id_field = `tube_id${tube_num}`;
        fillIfBlank(tube_id_field, entry["tube_id"]);

        let specimen_type_field = `tube_specimen_type${tube_num}`;
        selectFromDropdown(specimen_type_field, sample_metadata[sample_type]["code"]);

        let specimen_volume_field = `tube_volume${tube_num}`;
        fillIfBlank(specimen_volume_field, sample_metadata[sample_type]["volume"]);
      }
    }
  );
}

///////////////////////////////////////////////////////////////////////////////
//                              Data formatting                               //
///////////////////////////////////////////////////////////////////////////////

function formatEntry(sample_type_name, type_total, tube_id_prefix_string) {
  let type_entries = [];
  for (let i = 1; i <= type_total; ++i) {
    let tube_id = tube_id_prefix_string +
      "-" + sample_type_name +
      "-" + i;

    let entry = {
      "tube_id": tube_id
    };
    type_entries.push(entry);
  }

  return type_entries;
}

function formatData(data) {
  const adrc_id = data["adrc_id"];
  let n_rows = 0;
  let tube_id_prefix_string = adrc_id;
  tube_id_prefix_string += "-" + data["event"];

  let all_entries = {"n_rows": 0};

  let sample_types = {
    "plasma_total": "P",
    "serum_total": "S",
    "buffy_coat_total": "BC",
    "paxgene_total": "PG"
  }

  for (const [type, code] of Object.entries(sample_types)) {
    let type_entries = formatEntry(code, data[type], tube_id_prefix_string);
    all_entries["n_rows"] += type_entries.length;
    all_entries[type] = type_entries;
  }

  return all_entries;
}

///////////////////////////////////////////////////////////////////////////////
//                                 Data entry                                //
///////////////////////////////////////////////////////////////////////////////
// Copied from SAPDAP
// https://github.com/ctsit/search_and_populate_data_from_another_project/blob/master/js/custom_data_search.js

function fillIfBlank(field_name, value) {
  let $target_field = $(`input[name='${field_name}']`);
  // Don't overwrite field if a value is there
  if ($target_field.val() != "") { return; }

  $target_field.val(value);

  // trigger field validation
  $target_field.blur();
}

function selectFromDropdown(key, value) {
  const $target_row = $(`tr[sq_id='${key}']`);
  const $ac_target_field = $($target_row.find("input")[0]); // ac = auto complete
  const $select_field = $(`select[name='${key}']`);

  // used to handle cases where the value provided is the displayed value of the desired option,
  // rather than the coded value (value attribute)
  const displayed_option_value = $select_field
        .children()
        .filter( (i, e) => {
          return ( $(e).html() == value );
        } )
        .val();

  // autocomplete fields
  if ($ac_target_field.attr('class') == 'x-form-text x-form-field rc-autocomplete ui-autocomplete-input') {
    // the non-coded value must be put in the text box to allow the user to see the pipe occured
    // if displayed_value is undefined, this function sets the value to nothing
    const displayed_value = $select_field
          .children(`[value='${value}']`)
          .html();
    $ac_target_field.val(displayed_value);

    if ($ac_target_field.val() != value && displayed_option_value != undefined) {
      // TODO: handle the possibilty that this value could go in an "other" field behind branching logic
      $ac_target_field.val(value);
    }
    return;
  }

  // non autocomplete fields
  $select_field.val(value);
  if ($select_field.val() != value && displayed_option_value != undefined) {
    // TODO: handle the possibilty that this value could go in an "other" field behind branching logic
    $select_field.val(displayed_option_value);
  }
}
