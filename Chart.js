import React from "react";
import { MetaCrudContext } from "./MetaCrud";
import useApi from "./useApi";
import Loading from "./Loading";

const ChartContext = React.createContext();

function Chart() {
  const { tablename, api_url, table_meta } = React.useContext(MetaCrudContext);
  const { chart, handleChange, charts } = useChartSelector();

  return (
  <ChartContext.Provider value={{ chart, handleChange, charts }}>
    <div className="Chart">
      <ChartSelector charts={charts} handleChange={handleChange} selectedChart={chart} />
      { chart && <ChartRender /> }
    </div>
  </ChartContext.Provider>
  );
}

// ***************************************************************************************
const ChartRenderContext = React.createContext();

function ChartRender() {
  const {chart} = React.useContext(ChartContext);
  const { tablename, api_url, wrappers } = React.useContext(MetaCrudContext);
  const chartType = chart?.type ?? "Table";
  const chartName = chart?.name;
  const chartSettings = chart?.settings ?? {};
  const chartFilters = chartSettings?.filters?.map((filter) => {
    let value = null;
    switch (filter?.defaultValue){
      case 'today':
        value = new Date().toISOString().split('T')[0];
        break;
      default:
        value = filter?.defaultValue ?? undefined;
    }
     return ({ [filter.field]: value });
    })?.reduce((acc, curr) => ({ ...acc, ...curr }), {});

  console.log(chartFilters);

  const [filters, setFilters] = React.useState(chartFilters);


  const query = '&' + Object.keys(filters)
  .filter(key => filters[key]!==undefined)
  .map(key => key+'='+filters[key]).join('&');
  console.log(query);

  const chart_records_hook = useApi(api_url + "/chart/" + tablename + '?name=' + chartName, query, true, [query], ()=>{});

  return ( !chartName ? <div>Error de configuración.</div> :
    <ChartRenderContext.Provider value={{chart_records_hook, filters, setFilters, chartSettings}}>
    <div className="ChartRender">
      <Filters />
      {chartType === "PivotTable" && <PivotTableChart />}
    </div>
    </ChartRenderContext.Provider>
  );
}

// ***************************************************************************************
function FilterInput({filters, filter, onChange}){
  
  return (
    <input type={filter?.type??"text"} name={filter?.field} className="form-control w-auto" placeholder={filter?.placeholder} onChange={onChange} value={filters?.[filter?.field] ?? ""} />
  );
  /*
  const record = { "CinemaId":"monitor"};
  const { wrappers } = React.useContext(MetaCrudContext);

  let element = wrappers?.[filter?.field];

  const Wrapper = element;

  return (<div>
    { Wrapper ? <Wrapper record={record} field="CinemaId" /> : 
      <input type={filter?.type??"text"} />
    }
  </div>);
  */
}
// ***************************************************************************************

function Filters(){
  const {filters, setFilters, chartSettings} = React.useContext(ChartRenderContext);
  const {chart} = React.useContext(ChartContext);
  const chartFilters = chartSettings?.filters ?? [];

  const textFilterHandler = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value ? value : undefined, // Set to undefined if empty
    }));
  }

  return (
    <div className="Filters">
      <h3>Filtros</h3>
      {chartFilters.map((filter, index) => (
        <FilterInput key={index} filters={filters} filter={filter} onChange={textFilterHandler} />
      ))}
    </div>
  );
}

// ***************************************************************************************

function PivotTableChart() {

  const {chart} = React.useContext(ChartContext);
  const { chart_records_hook } = React.useContext(ChartRenderContext);
  //const columnsField = chart?.settings?.columnsField;
  //const rowsField = chart?.settings?.rowsField;
  const rowsFields = chart?.settings?.rowsFields ?? [];
  //const valuesField = chart?.settings?.valuesField;


  const headersStyle ={textOrientation: 'sideways', writingMode: 'vertical-rl', transform: 'rotate(180deg)', verticalAlign: 'middle'};

  const headers = chart_records_hook?.response?.data?.headers ?? [];
  const rows = chart_records_hook?.response?.data?.rows ?? [];
  return ( chart_records_hook?.loading ? <Loading legend='Cargando...' /> :
  <div className="PivotTableChart">
    <div className={'table-responsive w-auto'}>
      <table className='table w-auto table-striped table-hover m-0 border border-tertiary border-1'>
        <thead>
          <tr>
            {
              rowsFields?.map((rowsField, index) => (
                <th key={index} className='p-1'>{rowsField?.l}</th>
              ))
            }
            {headers.map((header, index) => (
              <th key={index} className='p-1' style={headersStyle}
              >{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {
                rowsFields?.map((rowsField, index) => (
                  <td key={index} className='text-left p-1'>{row[rowsField?.a]}</td>
                ))
              }
              {headers.map((header, index) => (
                <td key={index} className='text-center p-1'>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className='p-1 fw-bold' colSpan={rowsFields?.length}>Totales</td>
            {headers.map((header, index) => (
              <td key={index} className='text-center p-1 fw-bold'>{rows.reduce((acc, row) => Number(acc) + Number(row[header]), 0)}</td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>

  </div>
  );
}

// ***************************************************************************************

function TableChart({ chart }) {

  return (<div className="TableChart"></div>);
}

// ***************************************************************************************

function useChartSelector() {
  const { table_meta } = React.useContext(MetaCrudContext);
  const charts = table_meta?.charts ?? [];
  const [chart, setChart] = React.useState(charts[0] || null); // Initialize with the first chart if available

  function handleChange(e) {
    setChart(charts.find((c) => c.name === e.target.value) || null);
  }

  return { chart, handleChange, charts };
}

// ***************************************************************************************

function ChartSelector({ charts, handleChange, selectedChart }) {
  return (
    <div className="ChartSelector Selector">
      <select value={selectedChart?.name || ""} onChange={handleChange} className="form-select">
        <option value="">Select a chart</option>
        {charts.map((chart, index) => (
          <option key={index} value={chart.name}>
            {chart.title}
          </option>
        ))}
      </select>
    </div>
  );
}

// ***************************************************************************************

export default Chart;


/*
import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import { Chart as GoogleChart } from 'react-google-charts';
import Loading from './Loading';


function Chart() {
  const { records_data_hook, api_url, tablename } = React.useContext(MetaCrudContext);
  const columnsField = 'descripcion';
  const rowsField = 'usuario';
  const valuesField = 'ventas_unidades';
  const chartHeaders = [ rowsField, ...records_data_hook?.response?.data?.rows?.map((row) => row[columnsField])?.filter((value, index, self) => self.indexOf(value) === index) ];
  const chartSiders = records_data_hook?.response?.data?.rows?.map((row) => row[rowsField])?.filter((value, index, self) => self.indexOf(value) === index);
  const chartData = [chartHeaders];
  
  let dataObj = {};
  records_data_hook?.response?.data?.rows?.forEach((row) => {
    const rowIndex = chartSiders.indexOf(row[rowsField]);
    if (!dataObj[row[columnsField]]) {
      dataObj[row[columnsField]] = Array(chartSiders.length).fill(0);
    }
    dataObj[row[columnsField]][rowIndex] = row[valuesField];
  });

  chartSiders.forEach((sider, index) => {
    const row = [sider];
    chartHeaders.slice(1).forEach((header) => {
      row.push(dataObj[header] ? dataObj[header][index] : 0);
    });
    chartData.push(row);
  });
  return (records_data_hook?.loading ? <Loading legend='Cargando...' /> :
    <div className='Chart'>
      <GoogleChart  // <-- Alias para Google Charts
        chartType="Table"
        width="100%"
        height="400px"
        data={chartData}  
      />
    </div>
  )
}

export default Chart
*/