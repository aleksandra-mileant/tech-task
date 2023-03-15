import React, { useState } from 'react';
import { useMyContext } from "../../helpers/myContext";
import { Matrix } from "../Matrix";
import { Cell } from "../../App";

export const Main: React.FC = () => {
  const { rows, cells, setRows, setCells } = useMyContext();
  const [matrix, setMatrix] = useState<Cell[][]>(() => createMatrix(rows, cells));
  const [nearestAmountNumber, setNearestAmountNumber] = useState<number>(5);
  const [error, setError] = useState<boolean>(false);

  function createMatrix(rows: number, columns: number): Cell[][] {
    const matrix: Cell[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < columns; j++) {
        const id = i * columns + j;
        const amount = Math.ceil(Math.random() * 999);
        const cell: Cell = { id, amount };
        row.push(cell);
      }
      matrix.push(row);
    }
    return matrix;
  }
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fieldName = event.target.name;
    const value = Number(event.target.value.replace(/\D/g,''));

    if (fieldName === 'rows') {
      setRows(value);
      setMatrix(createMatrix(value, cells));
    } else if (fieldName === 'cells') {
        setCells(value);
        setMatrix(createMatrix(rows, value));
    } else if (fieldName === 'amountNumber') {
        setNearestAmountNumber(value);
        if (value > rows * cells) {
          setError(true);
        } else {
          setError(false);
        }
    }
  }

  return (
    <section className="main">
      <form className="form">
        <div className="form-field">
          <label htmlFor="rows">Number of Rows:</label>
          <input
            className="form-input"
            type="text" name="rows"
            value={rows}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="cells">Number of Cells:</label>
          <input
            className="form-input"
            type="text"
            name="cells"
            value={cells}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <p>Show</p>
          <input
            className="form-input"
            type="text"
            name="amountNumber"
            value={nearestAmountNumber}
            onChange={handleInputChange}
          />
          <p>nearest amount</p>
          {error && (
            <p className="form-error">
              The number is greater than the sum of the cells
            </p>
          )}
        </div>
      </form>
      <Matrix
        matrix={matrix}
        setMatrix={setMatrix}
        nearestAmountNumber={nearestAmountNumber}
      />
    </section>
  );
};
