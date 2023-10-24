# Change Log
All notable changes to the adrc_biorepository_tube_id_writer module will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.1.1] - 2023-10-24
### Added
- Initial release (Kyle Chesney)
- This module reads a subject ID and counts of biospecimen tubes from REDCap a static list of REDCap fields to create tube-count records for each tube type.
- The code adds static data to generate and set tube IDs in a prescribed order.
- It also sets default values for tube volume on each tube.
