# D3 Scales

Scales are used to scale and normalize values. You can use a scale to convert a value from one range to another range, convert a value to color, Convert strings to other values like colors or numbers. 

For this example continue with the code from the previous example. You should have something like this: 

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <svg id="svg" width="500" height="500"></svg>

  <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
  <script>
    d3.csv('cities.csv')
      .then(data => {
        console.log(data)
        d3.select('#svg')
          .style('border', '1px solid')
          // select all <circle>s in #svg
          .selectAll('circle')
          .data(data)
          .enter()
          .append('circle')
          .attr('cx', d => parseFloat(d.x) * 2 + 250)
          .attr('cy', d => parseFloat(d.y) * 2 + 250)
          .attr('r', d => parseInt(d.population) * 0.00001)
          .attr('fill', `red`)
          .attr('opacity', 0.25)
          .attr('fill', d => {
            if (d.country === 'USA') {
              return 'cornflowerblue'
            } else if (d.country === 'Pakistan') {
              return 'gold'
            } else if (d.country === 'Italy') {
              return 'green'
            } else if (d.country === 'Brazil') {
              return 'tomato'
            }
          })
      })
  </script>
</body>
</html>
```

## Bubble Charts

This example will create a simplified bubble chart. To make a full bubble chart you can combine the ideas here with ideas that come in later tutorials. read more about bubble charts here: https://datavizcatalogue.com/methods/bubble_chart.html

## Using D3 Scales

A scale needs a domain and a range. The domain is the input and the range is the output.

The `scaleLinear(domain, range)` function creates a function that returns a linearly scaled value from the domain and range provided. 

https://d3js.org/d3-scale/linear#scaleLinear

**Domains**

A scale needs to know the extents of the domain. The extent is the minimum and maximum values of the domain. Think of it like the borders. 

For example, in our cities data, the x value is roughly in the range of -46 to +122. Those are the extents!

The domain for the countries might be an array of all available country names: `['USA', 'Pakistan', 'Italy', 'Brazil']`. 

The domain of population is crazy large numbers nuf said. 

**Ranges**

Ranges can be numbers or other values and can be expressed as min and max values or a list of possible choices. 

For example, if we are posting something on the screen and our SVG canvas is 500 pixels wide the range is 0 to 500. 

If we have a list of colors to match our countries against the range might be: `['cornflowerblue', 'gold', 'gold', 'tomato']` a list of colors! 

When it comes to the population we might know that we want the largest circle to be 300px and the smallest to be 10px. 

D3 has several functions that return a scale function that you configure for your use. 

## Scale Linear

A linear scale scales a value proportionally from the domain to the range. 

Create a linear scale. 

```JS
d3.csv('cities.csv')
  .then(data => {
    // Create a linear scale
    const xScale = d3.scaleLinear()
      .domain([-150, 150]) // Set the domain
      .range([0, 500])     // Set the range

    // Start doing D3 stuff
    d3.select('#svg')
      .style('border', '1px solid')
      // select all <circle>s in #svg
      ...
```

What happened here: 

```JS
const xScale = d3.scaleLinear()
  .domain([-150, 150]) // Set the domain
  .range([0, 500])     // Set the range
```
Here you are creating a function `xScale` that is a linear scale function. 

You set the domain to `[-150, 150]`. This says this function will translate numbers from `-150` to `+150`. In other words the smallest number your scale is expecting is `-150` and the largest is `+150`. That's the extents!

Last you set the range to `[0, 500]`. This says your scale function will return values from `0` to `500`. 

All together the `xScale` function expects to take in numbers from `-150` to `150` and return values from `0` to `500`. You should expect (a little mental unit test!):

- `xScale(-150)` to return `0` 
- `xScale(0)` to return `250` 
- `xScale(150)` to return `500`

Use `xScale` to set the `cx` attribute: 

```JS
...
.attr('cx', d => xScale(d.x)) // scale x with xScale
...
```

This is a big improvement over the last system you used! 

Changing the size of your SVG. makes it 800 wide. 

```HTML
...
<svg id="svg" width="800" height="500"></svg>
...
```

Fix the scale to match the new width. To do this you'll change the range of the scale. The domain has not changed. 

```JS
const xScale = d3.scaleLinear()
  .domain([-150, 150])
  .range([0, 800]) // Change the range!
```

**Challenge**

Create a new linear scale for the y value. The min y is -37 and the max is 42. Why not say the extent is -50 to +50. The range is the height of the SVG which is 500. 

### d3.extent
In the previous examples you may be asking where numbers like `525010` and `14910352` or `-37` and `42` came from? The first pair is the maximum and minimum populations from and the second pair are the minimum and maximum y values, from the cities data. 

D3 provides some helper functions that can find minimum and maximum values for you. The `d3.extent(iterable, accessor)` function returns an array with the maximum and minimum values. 

https://d3js.org/d3-array/summarize#extent

Try it for yourself. Replace the `populationScale` with this: 

```JS
const popScale = d3.scaleLinear()
  // .domain([525010, 14910352])
  .domain(d3.extent(data, d => d.population))
  .range([20, 200])
```

Here the min and max populations are found from the data. Notice that you are providing `extent()` with an array. The second paramter is a function that returns the value you are interested in finding the extents of `d => d.population`. 

**Challenge**
Use `extent()` to find the domain and range for the `xScale` and `yScale`.

### Scale Ordinal

An ordinal scale maps arbitrary values like strings and dates to other arbitrary values like other strings and colors. Use an ordinal scale to map strings to other values. 

https://d3js.org/d3-scale/ordinal#scaleOrdinal

To map country names to colors you would use an ordinal scale. 

Define a new oridinal scale: 

```JS
const countryScale = d3.scaleOrdinal()
  .domain(['USA', 'Pakistan', 'Italy', 'Brazil'])
  .range(['cornflowerblue', 'gold', 'gold', 'tomato'])
```

Then use this new scale to set the color: 

```JS
...
.attr('fill', d => countryScale(d.country))
...
```

This was a big improvement! 

What about population? This was a very ugly implementation with some arbitrary values. Why multiply by `0.00001`? We can do better with a scale! 

Make a new scale: 

```JS
const popScale = d3.scaleLinear()
  .domain([525010, 14910352])
  .range([10, 100])
```

Here I found the largest and smallest population values and used these for the domain. 

Then I decided on the largest and smallest circles radius I wanted. I chose: 10 and 100. 

Now use the scale: 

```JS
...
.attr('r', d => popScale(d.population))
...
```

This is a lot better than the previous solution. We can do better still and D3 can do the work of finding the extents for us, read on! 

**Challenge**

Edit the range until the largest and smallest circles are sizes that you like. 

### scaleSqrt

Wait! These circles do not display the populations as accurately as they could be. Currently, we're showing the diameter as the population but the circle expresses itself as an area. 

You can think of this as drawing a line where each pixel represents a person. If you had a 10-pixel line and a 20-pixel line the second would represent twice as many people. 

If you drew a 10px radius circle it would contain 78 pixels. A 20-pixel diameter circle would contain 314 pixels. The difference there is about 4 to 1. Remember you are trying to express a 2 to 1 relation. In this example the visual would represent a 4 to 1 relationship! 

D3 can help you solve this with a scale! 

`scaleSqrt` scales by area rather than linear. Try it out here. 

Edit the `popScale`:

```JS
const popScale = d3.scaleSqrt()
  .domain(d3.extent(data, d => d.population))
  .range([20, 200])
```

Notice the change, they may appear to be subtle. The sizes should be more accurately related now. 

## Finding min and max 

This is getting better all the time! There are still a couple of places where our code is awkward. 

Notice the population scale. To get the range we needed to look at the `cities.csv` and find the largest and smallest values. This would not work with more than 10 items. It's not going to work if something changes. 

The same is true for the `x` and `y` coordinates. 

You could use vanilla JS to calculate these but D3 provides some helper functions. 

In your code before you create your scales add: 

```JS
const minX = d3.min(data, d => parseFloat(d.x))
const maxX = d3.max(data, d => parseFloat(d.x))
```

You can use these values in place of the hard coded numbers:

```JS
const xScale = d3.scaleLinear()
  .domain([minX, maxX]) // Use the min and max here
  .range([700, 100])
```

Note! You could have used `extent()` but this would have returned an array with the min and max values. So why use `d3.min()` and `d3.max()`? In some cases you might want to two values separately, for example if you wanted to round the values up or for another reason. 

Consider the x and y coordinates. Using the min and max values for these places some of the objects at the edges of the diagram. This migth not look that great with circles since this places half the circle off the edge of the view. 

Try replacing the `xScale` with:

```JS
// Create a linear scale
// Get the min and max for x (be sure to convert these to numbers!)
const minX = d3.min(data, d => parseFloat(d.x))
const maxX = d3.max(data, d => parseFloat(d.x))

console.log('min', minX, 'max', maxX)
const xScale = d3.scaleLinear()
  .domain([minX, maxX]) // Use the min and max values
  .range([0, 800])     // Set the range
```

This finds the min and max values for x. `extent()` would have done the same! Notice how this places some of the objects at the edges of the diagram. With the separate min and max values you can adjust the appearance. Try this: 

```JS
  .domain([minX - 50, maxX + 50])
```

This pushes everything 50px from the left edge to the right and 50px to the left from the right edge. 

**Challenge**

Find the min and max y values.

Use these values in the domain for the y scale function. 

**Challenge**

Find the min and max population values. 

Use these values in the domain of the population scale function. 

### Making a set

The last area where things are not working well is in country names. We had to add all of these names manually. If there had been more than four this would not have been easy, and as it is it's not scalable solution. 

There is probably a strictly D3 method for this. I had a hard time figuring this out since the methods seem to change over different versions of d3. We are using d3 v7 which didn't have an obvious answer.

I used vanilla JS for this. Try this: 

```JS
const countries = Array.from(new Set(data.map(d => d.country)))
```

Here `countries` should be a list of unique country names. I made the unique array by first creating a Set. A set is like an array but may only contain unique values. Then I converted the set into an array.  

Use this to define the domain for your `countryScale`.

```JS
const countryScale = d3.scaleOrdinal()
  .domain(countries) // Use the list counties here
  .range(['cornflowerblue', 'gold', 'gold', 'tomato'])
```

While these changes don't make a visual change, behind the scenes they make big differences in how our code operates! Your diagram will look simialr to this: 

![example](images/example-1.png)

## Conclusion 

This chart is similar to bubble plot, read more about this here: https://www.data-to-viz.com/graph/bubble.html

## Conclusion 

In this tutorial you learned to use D3 scales. You used extents to find the min and max values. You defined the domain as the range of values your data comes from and converted these a range of values that were displayed with a scale. 
