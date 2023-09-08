import { useState, useEffect } from 'react';
import { File } from '../types/types';

export function useFilterFiles(
  files: File[],
  filterStatus: string | null,
  filterType: string | null,
  filterFileName: string | null,
  filterStartDate: string | null,
  filterEndDate: string | null
) {
  const [filteredFiles, setFilteredFiles] = useState<File[]>([]);
  const [resultCount, setResultCount] = useState<number>(0);

  useEffect(() => {
    const filteredFiles = files.filter((file) => {
      const statusMatches = !filterStatus || file.status === filterStatus;
      const typeMatches = !filterType || file.type === filterType;
      const fileNameMatches =
        !filterFileName ||
        file.file.toLowerCase().includes(filterFileName.toLowerCase());
      const dateMatches =
        (!filterStartDate || !filterEndDate) ||
        (filterStartDate &&
          filterEndDate &&
          file.created >= filterStartDate &&
          file.created <= filterEndDate) ||
        (filterStartDate && !filterEndDate && file.created >= filterStartDate) ||
        (!filterStartDate && filterEndDate && file.created <= filterEndDate);
      return statusMatches && typeMatches && fileNameMatches && dateMatches;
    });

    setFilteredFiles(filteredFiles);
    setResultCount(filteredFiles.length);
  }, [filterStatus, filterType, filterFileName, filterStartDate, filterEndDate, files]);

  return { filteredFiles, resultCount };
}
