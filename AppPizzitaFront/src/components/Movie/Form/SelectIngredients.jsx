import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';

SelectIngredients.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};

export function SelectIngredients({ field, data }) {
  const renderValue = (selected) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {selected.map((value) => {
        const ingrediente = data.find((item) => item.id_ingrediente === value);
        return (
          <Chip
            key={value}
            label={ingrediente ? ingrediente.nombre_ingrediente : value}
          />
        );
      })}
    </Box>
  );

  return (
    <FormControl fullWidth>
      <InputLabel id="ingredientes">Ingredientes</InputLabel>
      <Select
        {...field}
        labelId="ingredientes"
        label="Ingredientes"
        multiple
        value={field.value || []}
        renderValue={renderValue}
      >
        {data &&
          data.map((ingredientes) => (
            <MenuItem key={ingredientes.id_ingrediente} value={ingredientes.id_ingrediente}>
              {ingredientes.nombre_ingrediente}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
