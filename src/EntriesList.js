import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { getCoverFromEntry } from './helpers';

const Root = styled(Link)`
  display: flex;
  height: 80px;
  color: black;
  text-decoration: none;
  margin-bottom: 4px;
`;

const Cover = styled.div`
  width: 104px;
`;

const Body = styled.div`
  padding: 0 16px;
  max-width: calc(100% - 104px);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LabelDate = styled.h2`
  font-weight: bold;
  margin-bottom: 8px;
  margin: 0;
`;

const LabelBody = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Img = styled.img`
  object-fit: cover;
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
`;

const Entry = ({ entry }) => {
  const template = document.createElement('div');
  template.innerHTML = entry.body;

  return (
    <Root to={`/entry/${entry._id}`}>
      <Cover>
        <Img className="Entry-img" src={getCoverFromEntry(entry)} />
      </Cover>
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
