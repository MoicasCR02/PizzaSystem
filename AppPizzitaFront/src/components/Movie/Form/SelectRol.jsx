import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectRol.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectRol({ field, data }) {
  return (
    <>
      <>
        <InputLabel id="id_rol">Rol</InputLabel>
        <Select
          {...field}
          labelId="id_rol"
          label="id_rol"
          defaultValue=''
          value={field.value}
        >
          {data &&
            data.map((rol) => (
              <MenuItem key={rol.id_rol} value={rol.id_rol}>
                {rol.nombre}
              </MenuItem>
            ))}
        </Select>
      </>
    </>
  );
}
