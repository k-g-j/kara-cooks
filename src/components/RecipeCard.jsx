import React from 'react'
import Carousel from "react-elastic-carousel";

export default function RecipeCard({ recipe, onRemoveRecipe, onHandleView }) {

  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 },
  ];
  return (
    <div className="recipe" key={recipe.id}>
      <h3>{recipe.title}</h3>

      <p dangerouslySetInnerHTML={{ __html: recipe.desc }}></p>

      {recipe.viewing && (
        <div>
          <div className="imagesContainer">
            <Carousel className="carousel" breakPoints={breakPoints}>
              {recipe.images.map((imageUrl, i) =>
                <img
                  className="recipeImage"
                  key={i}
                  src={imageUrl}
                  alt="recipe-picture"
                />)}
            </Carousel>
          </div>

          <h4>Ingredients</h4>
          <ul>
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>

          <h4>Steps</h4>
          <ol>
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
      
      <div className="buttons">
        <button onClick={() => onHandleView(recipe.id)}> View {recipe.viewing ? 'less' : 'more'}{' '} </button>
        <button className="remove" onClick={() => onRemoveRecipe(recipe.id)}> Remove </button>
      </div>
    </div>
  )
}