import {select} from "d3-selection";
import {malagaStats, avgTemp, TempStat} from "../data/linechart.data";
import{extent, max} from "d3-array";
import{line} from "d3-shape";
import {scaleTime, scaleLinear, scaleOrdinal, scaleBand} from "d3-scale";
import {schemeCategory10} from "d3-scale-chromatic";
import { axisBottom, axisLeft } from "d3-axis";

//Lo primero que hay que hacer es definir una serie de constantes la anchura, altura y padding

const width = 500;
const height = 300;
const padding = 50;

//Creamos ahora la tarjeta
const card = select("#root")
  .append("div")
    .attr("class", "card");

//Ahora ya que tenemos la tarjeta comenzamos a dibujar sobre ella

const svg = card
    .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `${-padding} ${-padding} ${width + 2*padding} ${height + 2*padding}`); //aqui se da forma al cuadro donde vamos a pintar el grafico
      
//Vamos a definir el eje y, usando el mínimo de las temperaturas y el máximo de ellas como dominio
const yScale = scaleLinear()
  .range([height, 0])
  .domain([0, max(malagaStats.reduce((acc, s) => acc.concat(s.values), []))]) //Esto se usa para pintar desde 0º hasta la temperatura máxima que alcanza el gráfico

//El eje X, contiene como valores los meses del año (ordenados)
const xScale = scaleBand()
  .domain(["Ener", "Febr", "Mar", "Abr", "May", "Jun", "Jul", "Agos", "Sept", "Oct", "Nov", "Dic"])//solo pintamos el nombre de los meses
  .rangeRound([0, width])
  

// Pintamos la escala de gradiente en verde de más a menos color. 

const gradient = svg
    .append("defs")
      .append("linearGradient")
        .attr("id", "barGradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", "0")
        .attr("y1", height)
        .attr("x2", "0")
        .attr("y2", "0");
gradient
    .append("stop")
      .attr("offset", "0")
      .attr("stop-color", " #008425");
gradient
    .append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#00b586");
gradient
    .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#0affb0");


const barGroup = svg
  .append('g');

// Painting the bar chart
barGroup
  .selectAll('rect')
  .data(avgTemp)
  .enter()
  .append("rect")
    .attr("x", (s,i) => xScale.bandwidth()*i)
    .attr("y", (d) => yScale(d) )
    .attr("width", xScale.bandwidth()  )
    .attr("height", (d) => height - yScale(d) )
    .attr("fill", "url(#barGradient)");


//Añadimos el eje X
barGroup.append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(axisBottom(xScale));

//Añadimos el eje Y
barGroup.append('g')
    .call(axisLeft(yScale));

svg.append('text')
    .attr('x', -(height / 2) )
    .attr('y', -padding/2)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .style("comic-san","11")
    .text('Temperaturas medias en Málaga')

svg.append('text')
    .attr('x', 4.5 * width / 5 )
    .attr('y', height + padding)
    .attr('text-anchor', 'middle')
    .text('Meses (2018)')

