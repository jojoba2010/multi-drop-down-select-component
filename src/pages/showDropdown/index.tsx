import React from 'react'
import Ball from '../../assets/ball.png'
import Gamepad from '../../assets/gamepad.png'
import Education from '../../assets/education.png'
import Science from '../../assets/science.png'
import Art from '../../assets/art.png'
import Health from '../../assets/health.png'
import Dropdown from '../../components/UI/dropdown'
interface Item {
  label: string;
  value: string|number;
  icon?: string;
}
const ShowDropdown=()=> {
  const items=[{
    label: 'Education',
    value: 'education',
    icon: Education
  },
  {
    label: 'Science',
    value: 'science',
    icon: Science
  },
  {
    label: 'Art',
    value: 'art',
    icon: Art
  },
  {
    label: 'Sport',
    value: 'sport',
    icon: Ball
  },
  {
    label: 'Games',
    value: 'games',
    icon: Gamepad
  },
  {
    label: 'Health',
    value: 'Health',
    icon: Health
  }]
  const onChangeDropdown=(slectedValues:Item[])=>{
    console.log('slectedValues##', slectedValues)
  }
  const onNewItemAdded=(newItem:Item, allItems:Item[])=>{
    console.log('newItem##',newItem,'All items##' ,allItems)
  }
  return (<Dropdown 
          items={items} 
          onChange={onChangeDropdown} 
          onNewItemAdded={onNewItemAdded}   
          defaultValue={[{
            label: 'Science',
            value: 'science',
          }]}
          /> );
}

export default ShowDropdown;