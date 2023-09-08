import { useState, useEffect } from "react";
import { File } from "../types/types";
import axios from "axios";



export const useFetchFiles = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null); // Agregamos un estado para el error

  useEffect(() => {
    axios
      .get(
        'https://y76g48mgpg.execute-api.us-west-2.amazonaws.com/Prod/api/transactions?',
        {
          headers: {
            Authorization:
              'GvXcYnWD!&TuP0&8wtC6TXWG4JmonqAf3Xaj5@TTANm5aqW*FQSjMa$n6S^ksDxWQampAhceFTd3&dil3DF^5glHwb9E%p#Mfyb',
          },
        }
      )
      .then((response) => {
        const data = response.data;
        setFiles(data);
        setError(null); // Borramos el error si la solicitud es exitosa
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
        setError('No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde'); // Establecemos un mensaje de error
      });
  }, []);

  return { files, error }; // Retornamos tanto los archivos como el error
};
