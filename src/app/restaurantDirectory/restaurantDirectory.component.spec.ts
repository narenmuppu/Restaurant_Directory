import {async, ComponentFixture, TestBed, tick} from '@angular/core/testing';
import {RestaurantDirectory} from './restaurantDirectory.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';

describe('RestaurantDirectory', () => {
  let component: RestaurantDirectory;
  let fixture: ComponentFixture<RestaurantDirectory>;
  let restaurantNameInput;
  let cityNameInput;
  let submitBtn;
  let compiled;

  const pushValue = async (value1, value2) => {
    restaurantNameInput.value = value1;
    restaurantNameInput.dispatchEvent(new Event('change'));
    restaurantNameInput.dispatchEvent(new Event('input'));
    cityNameInput.value = value2;
    cityNameInput.dispatchEvent(new Event('change'));
    cityNameInput.dispatchEvent(new Event('input'));
    submitBtn.click();
    await fixture.whenStable();
  };

  const getByTestId = (testId: string) => {
    return compiled.querySelector(`[data-test-id="${testId}"]`);
  };


  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          RouterTestingModule,
          FormsModule
        ],
        declarations: [RestaurantDirectory]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantDirectory);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    restaurantNameInput = getByTestId('restaurant-name-input');
    cityNameInput = getByTestId('city-name-input');
    submitBtn = getByTestId('submit-button');
    fixture.detectChanges();
  });

  it('Initial UI is rendered as expected', async () => {
    expect(restaurantNameInput.value).toBeFalsy();
    expect(cityNameInput.value).toBeFalsy();
    expect(getByTestId('restaurant-list').children.length).toEqual(0);
  });

  it('Should add new values on btn click', async () => {
    const values1 = ['Hard Rock Cafe', 'Subway', 'McDonalds'];
    const values2 = ['San Jose', 'Seattle', 'New York'];
    await pushValue(values1[0], values2[0]);
    await pushValue(values1[1], values2[1]);
    await pushValue(values1[2], values2[2]);
    await fixture.autoDetectChanges(true);

    const restaurantList = getByTestId('restaurant-list');
    expect(restaurantList.children.length).toEqual(3);
    expect(restaurantList.children[0].children[0].innerHTML).toEqual('Hard Rock Cafe');
    expect(restaurantList.children[0].children[1].innerHTML).toEqual('San Jose');
    expect(restaurantList.children[1].children[0].innerHTML).toEqual('Subway');
    expect(restaurantList.children[1].children[1].innerHTML).toEqual('Seattle');
    expect(restaurantList.children[2].children[0].innerHTML).toEqual('McDonalds');
    expect(restaurantList.children[2].children[1].innerHTML).toEqual('New York');
  });

  it('Should clear the input after submit btn is clicked', async () => {
    await pushValue('Hard Rock Cafe', 'San Jose');
    await fixture.autoDetectChanges(true);
    await fixture.whenStable();

    const restaurantList = getByTestId('restaurant-list');
    expect(restaurantList.children.length).toEqual(1);
    expect(restaurantList.children[0].children[0].innerHTML).toEqual('Hard Rock Cafe');
    expect(restaurantList.children[0].children[1].innerHTML).toEqual('San Jose');
    expect(restaurantNameInput.value).toBeFalsy();
    expect(cityNameInput.value).toBeFalsy();
  });

  it('Should not add anything if either value is empty', async () => {
    await pushValue('Hard Rock Cafe', '');
    await fixture.autoDetectChanges(true);

    let restaurantList = getByTestId('restaurant-list');
    expect(restaurantList.children.length).toEqual(0);

    await pushValue('', 'San Jose');
    await fixture.autoDetectChanges(true);

    restaurantList = getByTestId('restaurant-list');
    expect(restaurantList.children.length).toEqual(0);

    await pushValue('', '');
    await fixture.autoDetectChanges(true);

    restaurantList = getByTestId('restaurant-list');
    expect(restaurantList.children.length).toEqual(0);
  });
});
