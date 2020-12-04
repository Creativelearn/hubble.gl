// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import {Input, ItemSelector, Slider} from 'kepler.gl/components';
import styled, {withTheme} from 'styled-components';

import {
  DEFAULT_PADDING,
  DEFAULT_ROW_GAP,
  GOOD_16_9,
  GOOD_4_3,
  HIGHEST_16_9,
  HIGHEST_4_3,
  HIGH_16_9,
  HIGH_4_3
} from './constants';

import {msConversion, estimateFileSize} from './utils';

const StyledSection = styled.div`
  align-self: center;
  color: ${props => props.theme.labelColor};
  font-weight: 500;
  font-size: 13px;
  margin-top: ${DEFAULT_PADDING};
  margin-bottom: ${DEFAULT_ROW_GAP};
`;

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  margin-right: 24px;
  margin-left: 24px;
`;

const StyledLabelCell = styled.div`
  align-self: center;
  color: ${props => props.theme.labelColor};
  font-weight: 400;
  font-size: 11px;
`;

const StyledValueCell = styled.div`
  align-self: center;
  color: ${props => props.theme.textColor};
  font-weight: 500;
  font-size: 11px;
  padding: 0 12px;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 88px auto;
  grid-template-rows: repeat(
    ${props => props.rows},
    ${props => (props.rowHeight ? props.rowHeight : '34px')}
  );
  grid-row-gap: ${DEFAULT_ROW_GAP};
`;

const ExportVideoPanelSettings = ({
  setMediaType,
  setCameraPreset,
  setFileName,
  setQuality,
  settingsData,
  durationMs,
  frameRate,
  resolution,
  mediaType,
  setDuration
}) => (
  <div>
    <StyledSection>Video Effects</StyledSection>
    <InputGrid rows={2}>
      <StyledLabelCell>Timestamp</StyledLabelCell> {/* TODO add functionality  */}
      <ItemSelector
        selectedItems={['None']}
        options={['None', 'White', 'Black']}
        multiSelect={false}
        searchable={false}
        onChange={() => {}}
        disabled={true}
      />
      <StyledLabelCell>Camera</StyledLabelCell>
      <ItemSelector
        selectedItems={settingsData.cameraPreset}
        options={[
          'None',
          'Orbit (90º)',
          'Orbit (180º)',
          'Orbit (360º)',
          'North to South',
          'South to North',
          'East to West',
          'West to East',
          'Zoom Out',
          'Zoom In'
        ]}
        multiSelect={false}
        searchable={false}
        onChange={setCameraPreset}
      />
    </InputGrid>
    <StyledSection>Export Settings</StyledSection>
    <InputGrid rows={3}>
      <StyledLabelCell>File Name</StyledLabelCell>
      <Input placeholder={settingsData.fileName} onChange={setFileName} />
      <StyledLabelCell>Media Type</StyledLabelCell>
      <ItemSelector
        selectedItems={settingsData.mediaType}
        options={['GIF', 'WebM Video', 'PNG Sequence', 'JPEG Sequence']}
        multiSelect={false}
        searchable={false}
        onChange={setMediaType}
      />
      <StyledLabelCell>Quality</StyledLabelCell>
      <ItemSelector
        selectedItems={settingsData.resolution}
        options={[
          GOOD_16_9.label,
          HIGH_16_9.label,
          HIGHEST_16_9.label,
          GOOD_4_3.label,
          HIGH_4_3.label,
          HIGHEST_4_3.label
        ]}
        multiSelect={false}
        searchable={false}
        onChange={setQuality}
      />
    </InputGrid>
    <InputGrid style={{marginTop: DEFAULT_ROW_GAP}} rows={2} rowHeight="18px">
      <StyledLabelCell>Duration</StyledLabelCell>

      <StyledValueCell>
        <SliderWrapper
          style={{width: '100%', marginLeft: '0px'}}
          className="modal-duration__slider"
        >
          {/* TODO onSlider1Change */}
          <Slider
            showValues={false}
            enableBarDrag={true}
            isRanged={false}
            value1={durationMs}
            step={100}
            minValue={100}
            maxValue={10000}
            style={{width: '70px'}}
            onSlider1Change={val => {
              setDuration(val);
            }}
          />
          {msConversion(durationMs)}
        </SliderWrapper>
      </StyledValueCell>
      <StyledLabelCell>File Size</StyledLabelCell>
      <StyledValueCell>
        {estimateFileSize(frameRate, resolution, durationMs, mediaType)}
      </StyledValueCell>
    </InputGrid>
  </div>
);

export default withTheme(ExportVideoPanelSettings);