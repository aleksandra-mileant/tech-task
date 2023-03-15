import React, {Dispatch, SetStateAction, useState} from 'react';

import classNames from "classnames";

import { useMyContext } from "../../helpers/myContext";
import { Cell } from "../../App";

interface Props {
  matrix: Cell[][],
  setMatrix: Dispatch<SetStateAction<Cell[][]>>,
  nearestAmountNumber: number,
}
export const Matrix: React.FC<Props> = ({ matrix, setMatrix, nearestAmountNumber}) => {
  const { rows, cells, setRows } = useMyContext();
  const [nearestCells, setNearestCells] = useState<number[] | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const calculateRowSums = (): number[] => {
    return matrix.map((row) =>
      row.reduce((acc, cell) => acc + cell.amount, 0));
  }

  const calculateColumnAverages = (): number[] | string[] => {
    if (rows > 0) {
      const columnSums: number[] = [];
      for (let i = 0; i < cells; i++) {
        const sum = matrix.reduce((acc, row) => acc + row[i].amount, 0);
        columnSums.push(sum);
      }
      return columnSums.map((sum) => (sum / rows).toFixed(2));
    }
    return Array(cells).fill(0).map(() => '-');
  }

  const addRow = () => {
    const newRow: Cell[] = [];
    for (let j = 0; j < cells; j++) {
      const id = matrix.length * cells + j;
      const amount = Math.ceil(Math.random() * 999);
      const cell: Cell = { id, amount };
      newRow.push(cell);
    }
    setMatrix(prevMatrix => [...prevMatrix, newRow]);
    setRows(rows + 1);
  }

  const deleteRow = (rowToDelete: number) => {
    setMatrix(matrix.filter((item, index) => index !== rowToDelete));
    setRows(rows - 1);
  }

  const handleCellClick = (rowIndex: number, cellId: number) => {
    setMatrix(prevMatrix => {
      return prevMatrix.map((row, i) => {
        if (i === rowIndex) {
          return row.map(cell => {
            if (cell.id === cellId) {
              return {
                ...cell,
                amount: cell.amount + 1
              };
            }
            return cell;
          });
        }
        return row;
      });
    });
  }

  const handleCellHover = (rowIndex: number, cellId: number, amount: number, amountNumber: number) => {
    const flattenMatrix = matrix.flat();
    const currentIndex = rowIndex * matrix[0].length + cellId;
    const sortedIndexes = flattenMatrix
      .map((cell, index) => ({ index, diff: Math.abs(cell.amount - amount) }))
      .filter(({ index }) => index !== currentIndex && flattenMatrix[index].amount !== amount)
      .sort((a, b) => a.diff - b.diff)
      .slice(0, amountNumber)
      .map(({ index }) => index);

    setNearestCells(sortedIndexes);
  }

  function calculatePercentile(rowIndex: number, cell: Cell) {
    const rowSum = calculateRowSums()[rowIndex];
    return ((cell.amount / rowSum) * 100).toFixed(2);
  }

  if (!cells) {
    return null;
  }

  return (
    <table>
      <thead>
      <tr>
        <th></th>
        {Array(cells).fill(0).map((value, index) => (
          <th key={index}>{index + 1}</th>
        ))}
        <th>Sum</th>
      </tr>
      </thead>
      <tbody>
      {
        matrix.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td className="amount--bold">{rowIndex + 1}</td>
            {row.map((cell) => {
              const percent = calculatePercentile(rowIndex, cell);
              return (
                <td
                  onClick={() => handleCellClick(rowIndex, cell.id)}
                  onMouseEnter={() => handleCellHover(rowIndex, cell.id, cell.amount, nearestAmountNumber)}
                  onMouseLeave={() => setNearestCells([])}
                  className={classNames('amount', {
                    'amount--hovered': nearestCells?.includes(cell.id) && nearestAmountNumber < rows * cells
                  })}
                  key={cell.id}
                >
                  {hoveredRow === rowIndex && (
                    <div
                      className="amount__background"
                      style={{height: `${+percent * 1.5}%`}}
                    />
                  )}
                  <p>
                    {hoveredRow !== rowIndex ? cell.amount : percent}
                  </p>
                </td>
              )
            })}
            <td
              className="amount__sum"
              onMouseEnter={() => setHoveredRow(rowIndex)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {hoveredRow !== rowIndex ? calculateRowSums()[rowIndex] : '100%'}
            </td>
            <td>
              <button
                className="amount__button amount__button--delete"
                onClick={() => deleteRow(rowIndex)}
              >x</button>
            </td>
          </tr>
        ))
      }

      <tr>
        <td className="amount--bold">Average</td>
        {calculateColumnAverages().map((average, i) => (
          <td className="amount__average" key={i}>{average}</td>
        ))}
        <td className="amount__add">
          <button
            className="amount__button amount__button--add"
            onClick={addRow}
          >+</button>
        </td>
      </tr>
      </tbody>
    </table>
  );
};
