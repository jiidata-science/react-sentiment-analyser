import React from 'react';
import Item from './item';

function List ({ analysis, handleItemDelete }) {
  const [ expanded, setExpanded ] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }

  return (
    <div className="analysed_list">
      <div>
        {analysis.map((each) =>
          <Item key={each.timeKey}
            element={each}
            handleExpansion={handleChange}
            expanded={expanded}
            handleItemDelete={handleItemDelete} />)}
      </div>
    </div>
  );
}

export default List;
