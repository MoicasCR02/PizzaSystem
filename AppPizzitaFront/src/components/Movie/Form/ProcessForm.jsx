import React from 'react';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import Tooltip from '@mui/material/Tooltip';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { SelectProcess } from './SelectProcesos';
import { TextField } from '@mui/material';

ProcessForm.propTypes = {
  data: PropTypes.array,
  control: PropTypes.object,
  index: PropTypes.number,
  onRemove: PropTypes.func,
  disableRemoveButton: PropTypes.bool,
  field: PropTypes.object,
};

export function ProcessForm({
  data,
  control,
  index,
  onRemove,
  disableRemoveButton,
  // eslint-disable-next-line no-unused-vars
  field,
}) {
  return (
    <section key={index}>
      <Grid size={12} md={12}>
        <List>
          <ListItem>
            <ListItemIcon>
              <Tooltip title={`proceso ${index + 1}`}>
                <IconButton>
                  <DirectionsRunIcon />
                </IconButton>
              </Tooltip>
            </ListItemIcon>
            <ListItemText>
              <Controller
                key={index}
                name={`proceso.${index}.id_proceso`}
                control={control}
                render={({ field }) => (
                  <SelectProcess field={field} data={data} />
                )}
              />
            </ListItemText>
            <ListItemText sx={{ m: 1 }}>
              <Controller
                key={index}
                name={`proceso.${index}.orden_estacion`}
                control={control}
                render={({ field }) => <TextField {...field} label="Orden Estacion" />}
              />
            </ListItemText>
            <ListItemIcon>
              <Tooltip title={`Eliminar Proceso ${index + 1}`}>
                <span>
                  <IconButton
                    key={index}
                    edge="end"
                    disabled={disableRemoveButton}
                    onClick={() => onRemove(index)}
                    aria-label="Eliminar"
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </ListItemIcon>
          </ListItem>
        </List>
      </Grid>
    </section>
  );
}
