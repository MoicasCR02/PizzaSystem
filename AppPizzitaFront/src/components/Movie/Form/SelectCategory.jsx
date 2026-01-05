import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectCategory.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectCategory({ field, data }) {
  return (
    <>
      <>
        <InputLabel id="id_categoria">Categorias</InputLabel>
        <Select
          {...field}
          labelId="id_categoria"
          label="id_categoria"
          defaultValue=''
          value={field.value}
        >
          {data &&
            data.map((categorias) => (
              <MenuItem key={categorias.id_categoria} value={categorias.id_categoria}>
                {categorias.nombre_categoria}
              </MenuItem>
            ))}
        </Select>
      </>
    </>
  );
}
