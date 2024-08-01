import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupChatPage } from './group-chat.page';

describe('GroupChatPage', () => {
  let component: GroupChatPage;
  let fixture: ComponentFixture<GroupChatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
