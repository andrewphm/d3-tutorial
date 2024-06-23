import * as d3 from 'd3';
import { useD3 } from './useD3';
import { useState, useEffect } from 'react';

function BarChart({ data, setData }) {
  const sortData = (key) => {
    const sortedData = [...data].sort((a, b) => {
      if (key === 'population') {
        return parseInt(b[key]) - parseInt(a[key]);
      } else {
        return a[key].localeCompare(b[key]);
      }
    });
    setData(sortedData);
  };

  const ref = useD3(
    (svg) => {
      const height = 500;
      const width = 800;
      const margin = { top: 20, right: 30, bottom: 30, left: 80 };

      const xscale = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.125);

      const yscale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => parseInt(d.population))])
        .rangeRound([height - margin.bottom, margin.top]);

      const colorScale = d3
        .scaleOrdinal(data.map((d) => d.country))
        .range(['cornflowerblue', 'gold', 'tomato', 'lime', 'brickred']);

      const bottomAxis = d3.axisBottom(xscale);
      const leftAxis = d3.axisLeft(yscale);

      svg
        .select('.x-axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(bottomAxis);

      svg.select('.y-axis').attr('transform', `translate(${margin.left}, 0)`).call(leftAxis);

      svg
        .select('.plot-area')
        .selectAll('.bar')
        .data(data, (d) => d.label)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('class', 'bar')
              .attr('x', (d) => xscale(d.label))
              .attr('width', xscale.bandwidth())
              .attr('y', height - margin.bottom)
              .attr('height', 0)
              .attr('fill', (d) => colorScale(d.country)),
          (update) => update,
          (exit) => exit.remove()
        )
        .transition()
        .duration(750)
        .attr('x', (d) => xscale(d.label))
        .attr('width', xscale.bandwidth())
        .attr('y', (d) => yscale(parseInt(d.population)))
        .attr('height', (d) => height - margin.bottom - yscale(parseInt(d.population)))
        .attr('fill', (d) => colorScale(d.country));
    },
    [data]
  );

  return (
    <div style={{ width: '100%' }}>
      <div>
        <button onClick={() => sortData('label')}>Sort by Name</button>
        <button onClick={() => sortData('country')}>Sort by Country</button>
        <button onClick={() => sortData('population')}>Sort by Population</button>
      </div>
      <svg
        ref={ref}
        style={{
          height: 500,
          width: '100%',
          marginRight: '0px',
          marginLeft: '0px',
        }}
      >
        <g className="plot-area" />
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default BarChart;
