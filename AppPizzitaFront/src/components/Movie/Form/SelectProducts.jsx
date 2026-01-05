import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectProducts.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectProducts({ field, data }) {
  return (
    <>
      <InputLabel id="productos">Productos</InputLabel>
      <Select
        {...field} // Esto asegura que el valor esté correctamente vinculado
        labelId="id_producto"
        label="id_producto"
        defaultValue="" // Valor por defecto vacío
        value={field.value || ''} // Asegura que el valor se actualice con el valor de field
      >
        {data && data.map((productos) => (
          <MenuItem key={productos.id_producto} value={productos.id_producto}>
            {productos.nombre_producto}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
