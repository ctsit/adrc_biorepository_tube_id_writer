# Change Log
All notable changes to the adrc_biorepository_tube_id_writer module will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).


## [0.1.2] - 2023-10-26
### Added
- Add example project and test data in ./examples (Philip Chase)

### Changed
- Throw an Error to halt module if data is present in the tube_id cell NOTE: this is lazy hack to avoid needing to refactor nested functions to set flags to safely halt (Kyle Chesney)
- Skip filling tube_specimen_type and tube_volume if tube_id contains data to prevent overwriting data (Kyle Chesney)


## [0.1.1] - 2023-10-24
### Added
- Initial release (Kyle Chesney)
- This module reads a subject ID and counts of biospecimen tubes from REDCap a static list of REDCap fields to create tube-count records for each tube type.
- The code adds static data to generate and set tube IDs in a prescribed order.
- It also sets default values for tube volume on each tube.
