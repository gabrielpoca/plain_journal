import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

const Root = styled(Link)`
  display: flex;
  color: black;
  text-decoration: none;
  margin: 16px 0 24px;
`;

const Body = styled.div`
  padding: 0 16px;
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LabelDate = styled.h2`
  font-size: 16px;
  line-height: 24px;
  height: 24px;
  font-weight: bold;
  margin: 0 0 4px;
`;

const LabelBody = styled.div`
  line-height: 24px;
  height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 300;
`;

const Entry = ({ entry }) => {
  const template = document.createElement('div');
  template.innerHTML = entry.body;

  return (
    <Root to={`/entry/${entry._id}`}>
      <Body>
        <LabelDate>{moment(entry.date).format('DD/MM/YY')}</LabelDate>
        <LabelBody>{template.innerText}</LabelBody>
      </Body>
    </Root>
  );
};

const EntriesList = props =>
  props.entries.map(entry => <Entry key={entry._id} entry={entry} />);

export default EntriesList;
