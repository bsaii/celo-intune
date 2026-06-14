import { Card, StyledBody } from 'baseui/card';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
} from 'baseui/modal';
import { SIZE, StyledDivider } from 'baseui/divider';
import { Button } from 'baseui/button';
import Image from 'next/image';
import { LabelMedium } from 'baseui/typography';
import React from 'react';
import { useStyletron } from 'baseui';

type AlbumModalProps = {
  isModalOpen: boolean;
  close: () => void;
};

const AlbumModal = ({ isModalOpen, close }: AlbumModalProps) => {
  const [css, theme] = useStyletron();
  return (
    <>
      <Modal
        onClose={close}
        isOpen={isModalOpen}
        overrides={{
          Dialog: {
            style: {
              width: '60vw',
              height: '80vh',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <ModalHeader>Album Name</ModalHeader>
        <ModalBody style={{ flex: '1 1 0' }}>
          <div
            className={css({
              position: 'relative',
              width: '100%',
              height: '30vh',
              marginBottom: '1.5rem',
            })}
          >
            <Image src='/album3.jpg' alt='album1' fill />
          </div>
          <div>
            <div
              className={css({
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              })}
            >
              <div
                className={css({
                  width: '55%',
                  display: 'flex',
                  justifyContent: 'space-between',
                })}
              >
                <LabelMedium>Title</LabelMedium>
                <LabelMedium>Album</LabelMedium>
                <LabelMedium>Duration</LabelMedium>
                <LabelMedium>Plays</LabelMedium>
              </div>
            </div>
            <StyledDivider $size={SIZE.section} />
            <FlexGrid flexGridColumnCount={1} flexGridRowGap='scale800'>
              <FlexGridItem>
                <Card>
                  <StyledBody
                    className={css({ display: 'flex', alignItems: 'center' })}
                  >
                    <div className={css({ marginRight: '.75rem' })}>
                      <Button>Play</Button>
                    </div>
                    <Image
                      src='/album2.jpg'
                      alt='album2'
                      width={50}
                      height={50}
                      className={css({ borderRadius: '10%' })}
                    />
                    <div
                      className={css({
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                      })}
                    >
                      <LabelMedium>
                        <div>Title</div>
                        <div
                          className={css({
                            color: theme.colors.contentTertiary,
                          })}
                        >
                          Artist
                        </div>
                      </LabelMedium>
                      <LabelMedium>Album</LabelMedium>
                      <LabelMedium>2:31</LabelMedium>
                      <LabelMedium>34,243</LabelMedium>
                      <Button>Like</Button>
                    </div>
                  </StyledBody>
                </Card>
              </FlexGridItem>
            </FlexGrid>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalButton kind='tertiary' onClick={close}>
            Cancel
          </ModalButton>
          <ModalButton onClick={close}>Okay</ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AlbumModal;
