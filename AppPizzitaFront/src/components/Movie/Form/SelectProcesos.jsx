import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectProcess.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectProcess({ field, data }) {
  return (
    <>
      <>
        <InputLabel id="procesos">Procesos</InputLabel>
        <Select 
          {...field}
          labelId="procesos"
          label="procesos"
          multiple
          defaultValue={[]}
          value={field.value}
        >
          {data &&
            data.map((procesos) => (
              <MenuItem key={procesos.id_proceso} value={procesos.id_proceso}>
                {procesos.nombre_proceso}
              </MenuItem>
            ))}
        </Select>
      </>
    </>
  );
}
