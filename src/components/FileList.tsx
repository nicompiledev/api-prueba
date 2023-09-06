import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import "../styles/FileList.css";

interface File {
  id: number;
  status: string;
  type: string;
  created: string;
  file: string;
}

const columns = [
  { field: 'status', headerName: 'Estado', width: 130 },
  { field: 'type', headerName: 'Tipo', width: 160 },
  { field: 'created', headerName: 'Creación', width: 100 },
  {
    field: 'file',
    headerName: 'Archivo',
    width: 150,
    valueGetter: (params: any) => {
      const url = params.value;
      if (url) {
        const nombreArchivo = url.substring(url.lastIndexOf('/') + 1);
        return nombreArchivo;
      } else {
        return "";
      }
    },
  },
];

const FileList: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<File[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [filterFileName, setFilterFileName] = useState<string>("");
  const [resultCount, setResultCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(
        "https://y76g48mgpg.execute-api.us-west-2.amazonaws.com/Prod/api/transactions?",
        {
          headers: {
            Authorization:
              "GvXcYnWD!&TuP0&8wtC6TXWG4JmonqAf3Xaj5@TTANm5aqW*FQSjMa$n6S^ksDxWQampAhceFTd3&dil3DF^5glHwb9E%p#Mfyb",
          },
        }
      )
      .then((response) => {
        const data = response.data;
        setFiles(data);
        setFilteredFiles(data);
        setResultCount(data.length);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, []);

  const filterFiles = () => {
    const filteredFiles = files.filter((file) => {
      const statusMatches = !filterStatus || file.status === filterStatus;
      const typeMatches = !filterType || file.type === filterType;
      const fileNameMatches = !filterFileName || file.file.toLowerCase().includes(filterFileName.toLowerCase());
      const dateMatches = (!filterStartDate || !filterEndDate) ||
        (filterStartDate && filterEndDate && file.created >= filterStartDate && file.created <= filterEndDate) ||
        (filterStartDate && !filterEndDate && file.created >= filterStartDate) ||
        (!filterStartDate && filterEndDate && file.created <= filterEndDate);
      return statusMatches && typeMatches && fileNameMatches && dateMatches;
    });

    setFilteredFiles(filteredFiles);
    setResultCount(filteredFiles.length);
  };

  useEffect(() => {
    filterFiles();
  }, [filterStatus, filterType, filterFileName, filterStartDate, filterEndDate]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const translateStatus = (status: string) => {
    const statusTranslations: { [key: string]: string } = {
      DUPLICATE: "DUPLICADO",
      SUCCESS: "COMPLETADO",
      ERROR: "CON ERROR",
      NEW: "NUEVO",
    };

    return statusTranslations[status] || status;
  };

  const translateType = (type: string) => {
    const typeTranslations: { [key: string]: string } = {
      UNKNOWN: "DESCONOCIDO",
      ELECTRONIC_INVOICE: "FACT. ELECTRÓNICA",
      CONTRACTOR_INVOICE: "FACT. CONTRATISTA",
    };

    return typeTranslations[type] || type;
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredFiles.slice(startIndex, endIndex);
  };

  return (
    <div className="file-list-container">
      <h1 className="file-list-title">Lista de Archivos Importados</h1>
      <div className="filter-container">
        <label>
          Filtrar por Estado:
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
          >
            <option value="">Seleccione un estado</option>
            <option value="DUPLICATE">DUPLICADO</option>
            <option value="SUCCESS">COMPLETADO</option>
            <option value="ERROR">CON ERROR</option>
            <option value="NEW">NUEVO</option>
          </select>
        </label>
        <label>
          Filtrar por Tipo:
          <select
            value={filterType}
            onChange={(event) => setFilterType(event.target.value)}
          >
            <option value="">Seleccione un tipo</option>
            <option value="UNKNOWN">DESCONOCIDO</option>
            <option value="ELECTRONIC_INVOICE">FACTURA ELECTRÓNICA</option>
            <option value="CONTRACTOR_INVOICE">FACTURA DE CONTRATISTA</option>
          </select>
        </label>
        <label>
          Filtrar por Fecha:
          <input
            type="date"
            value={filterStartDate}
            onChange={(event) => setFilterStartDate(event.target.value)}
            placeholder="Fecha de inicio"
          />
          <input
            type="date"
            value={filterEndDate}
            onChange={(event) => setFilterEndDate(event.target.value)}
            placeholder="Fecha de fin"
          />
        </label>
        <label>
          Filtrar por Nombre:
          <input
            type="text"
            value={filterFileName}
            onChange={(event) => setFilterFileName(event.target.value)}
            placeholder="Nombre del archivo"
          />
        </label>
      </div>
      <p className="result-count">Resultados: {resultCount}</p>
      <div className="data-grid-container">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.field}>{column.headerName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getPaginatedData().map((file) => (
              <tr key={file.id}>
                <td>{translateStatus(file.status)}</td>
                <td>{translateType(file.type)}</td>
                <td>{formatDate(file.created)}</td>
                <td>
                  {file.file ? (
                    file.file.substring(file.file.lastIndexOf('/') + 1)
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Anterior
        </button>
        <span>Página {currentPage}</span>
        <button
          disabled={currentPage * itemsPerPage >= resultCount}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default FileList;