var path = "samples.json";

const dataPromise = d3.json(path);
console.log("Data Promise: ", dataPromise);

upDatePlots('940');
//copy and paste this all into the options changed function! Make all of this a function!
function upDatePlots(id) {
    var belly_data = dataPromise.then(function(data) {
      console.log("json: ", data);
      let names =  data.names;
      console.log("names: ", names);
      var options = d3.select("#selDataset");
      for (let i = 0; i < names.length; i++){
        options.append("option").text(names[i]);
      };

      var metadata = d3.select("#sample-metadata");

      meta(data, id, metadata);
      horchart(data, id);
      bubble(data, id);
    
  });
};

d3.select("#selDataset").on("change", optionChanged());

function optionChanged(id) {
  upDatePlots(id);
};

function meta(data, id, ul) {
  for (let i = 0; i < data.samples.length; i++) {
    if (data.samples[i].id === id) {

      ul.html(`<li>id: ${data.metadata[i].id}</li>
      <li>age: ${data.metadata[i].age}</li>
      <li>bbtype: ${data.metadata[i].bbtype}</li>
      <li>ethnicity: ${data.metadata[i].ethnicity}</li>
      <li>gender: ${data.metadata[i].gender}</li>
      <li>location: ${data.metadata[i].location}</li>
      <li>wfreq: ${data.metadata[i].wfreq}</li>`);
    }
  }
}

function horchart(data, id) {
  for (let i = 0; i < data.samples.length; i++) {
    if (data.samples[i].id === id) {
      var string_id = id_string(data.samples[i])
      var dataset = [{
        type: 'bar',
        x: data.samples[i].sample_values.slice(0, 10).reverse(),
        y: string_id.slice(0,10).reverse(),
        orientation: "h",
        text: data.samples[i].otu_labels.slice(0, 10).reverse()
      }];

      Plotly.newPlot('bar', dataset);
      }
    }

}

function bubble(data, id) {
  for (let i = 0; i < data.samples.length; i++) {
    if (data.samples[i].id === id) {
      var dataset = [{
        x: data.samples[i].otu_ids,
        y: data.samples[i].sample_values,
        mode: 'markers',
        marker: {
          size: data.samples[i].sample_values,
          color: data.samples[i].otu_ids,
          colorscale: [[0, 'rgb(204, 255, 204)'], [1, 'rgb(0, 0, 204)']]
        },
        text: data.samples[i].otu_labels
      }]

      Plotly.newPlot('bubble', dataset);
    }
  }
}

function id_string(id_list) {
  var string_id = []
      for (let j = 0; j< id_list.otu_ids.length; j++) {
        string_id.push(`OTU ${id_list.otu_ids[j]}`);
      }
  return string_id;
}