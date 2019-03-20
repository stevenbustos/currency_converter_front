<template>
  <div class="container">
    <div class="jumbotron">
      <h1 class="display-4">Currency Converter!</h1>
      <p class="lead">Valiu technical test.</p>
      <hr class="my-4">
      <form>
        <div class="label">You send</div>
        <div class="form-group">          
          <div class="row no-gutters">
            <div class="col-4">
              <multiselect
                v-model="fromCurrency"
                track-by="code"
                label="code"
                placeholder="Select one"
                :options="flags"
                :searchable="true"
                :allow-empty="false"
              >
                <template slot="singleLabel" slot-scope="props"
                  style="backgroud-color: black;"
                >
                  <img
                    class="option__image"
                    :src="props.option.flag"
                    alt="Country flag"
                    style="width:5%;height:5%;"
                  >
                  <span class="option__desc">
                    <span class="option__title">{{ props.option.code }}</span>
                  </span>
                </template>
                <template slot="option" slot-scope="props">
                  <img
                    class="option__image"
                    :src="props.option.flag"
                    alt="Country flag"
                    style="width:6%;height:6%;"
                  >
                  <span class="option__title">{{ props.option.code }}</span>
                </template>
              </multiselect>
            </div>
            <div class="col">
              <input
                v-model="valueIn"
                type="number"
                class="form-control inpt"
                id="youSend"
                aria-describedby="money"
                placeholder="Enter amount"
                min="0"
              >
            </div>
          </div>
        </div>
        <h3 class="rate">
          Rate {{rateOut}}
        </h3>
        <div class="label">Receive</div>
        <div class="form-group">
          <div class="row no-gutters">
            <div class="col-4">
              <multiselect
                v-model="toCurrency"
                track-by="code"
                label="code"
                placeholder="Select one"
                :options="flags"
                :searchable="true"
                :allow-empty="false"
              >
                <template slot="singleLabel" slot-scope="props">
                  <img
                    class="option__image"
                    :src="props.option.flag"
                    alt="Country flag"
                    style="width:6%;height:6%;"
                  >
                  <span class="option__desc">
                    <span class="option__title">{{ props.option.code }}</span>
                  </span>
                </template>
                <template slot="option" slot-scope="props">
                  <img
                    class="option__image"
                    :src="props.option.flag"
                    alt="Country flag"
                    style="width:6%;height:6%;"
                  >
                  <span class="option__title">{{ props.option.code }}</span>
                </template>
              </multiselect>
            </div>
            <div class="col">
              <input
                v-model="valueOut"
                type="number"
                class="form-control inpt"
                id="receive"
                aria-describedby="money"
                placeholder="Result"
                style="background-color: white;"
                disabled
              >
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import flagsJson from "../assets/static/flags.json";

var API_IP = process.env.VUE_APP_API_IP;

export default {
  data() {
    return {
      rates: [],
      flags: [],
      fromCurrency: "",
      toCurrency: "",
      valueIn: 0,
      valueOut: 0,
      rateOut: 0
    };
  },
  watch: {
    fromCurrency: function() {
      this.getRate();
    },
    toCurrency: function() {
      this.getRate();
    },
    valueIn: function() {
      this.getRate();
    }
  },
  mounted() {
    this.getRatesDb();
    this.getAllCountries();
  },
  methods: {
    // Get all the countries and flags
    getAllCountries: function() {
      for (var i in flagsJson) {
        var flag = {};
        flag["code"] = flagsJson[i].code;
        flag["flag"] = flagsJson[i].flag;
        this.flags.push(flag);
      }
    },
    // Get all the rates from the DB
    getRatesDb: function() {
      axios
        .get(API_IP + "/rates")
        .then(response => {
          for (var i in response.data) {
            for (var j in response.data[i].rates) {
              var rate = {};
              rate["code"] = j;
              rate["rate"] = response.data[i].rates[j];
              this.rates.push(rate);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // Call the API to do the conversion
    getRate: async function() {
      // Validates that the values are not empty
      if (
        this.fromCurrency !== "" &&
        this.fromCurrency !== null &&
        this.fromCurrency !== undefined &&
        this.toCurrency !== "" &&
        this.toCurrency !== null &&
        this.toCurrency !== undefined &&
        this.valueIn !== "" &&
        this.valueIn !== null &&
        this.valueIn !== undefined
      ) {
        axios
          .get(API_IP + "/convert", {
            params: {
              from_currency: this.fromCurrency["code"],
              to_currency: this.toCurrency["code"],
              money_amount: this.valueIn
            }
          })
          .then(response => {
            console.log(response.data.msg);
            this.rateOut = response.data.data.rate.toFixed(10);
            this.valueOut = response.data.data.result.toFixed(5);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>

<style>
.jumbotron {
  background-color: white !important;
  border-style: solid;
  border-width: 2px;
  border-color: gray;
}

.label {
  text-align: right !important;
  margin: 0;
  color: rgba(113, 97, 255);
  font-weight: bold !important;
  font-size: 14px !important;
  margin-top: 17px;
}

.inpt {
  height: 100%;
  text-align: right;
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

.form-group{
  border-width: 2px;
  border-style: solid;
  border-color: rgba(114,96,255,1);
  border-radius: 5px;
}

.no-gutters {
  margin-right: 0;
  margin-left: 0;  

  > .col,
  > [class*="col-"] {
    padding-right: 0;
    padding-left: 0;
  }
}
.multiselect {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    display: block;
    position: relative;
    width: 100%;
    min-height: 40px;
    text-align: left;
    color: #35495e;
}

.multiselect__select {
    position: absolute;
    width: 40px;
    height: 38px;
    right: 1px;
    top: 1px;
    padding: 4px 8px;
    text-align: center;
    -webkit-transition: -webkit-transform .2s ease;
    transition: -webkit-transform .2s ease;
    transition: transform .2s ease;
    transition: transform .2s ease, -webkit-transform .2s ease;
}

.multiselect__select:before {
    position: relative;
    right: 0;
    top: 65%;
    color: white;
    margin-top: 4px;
    border-color: white transparent transparent;
    border-style: solid;
    border-width: 5px 5px 0;
    content: "";
}

.multiselect__tags {
    min-height: 40px;
    display: block;
    padding: 8px 40px 0 8px;
    border-radius: 5px;
    border: 1px solid rgba(114,96,255,1);
    background: rgba(114,96,255,1);
    font-size: 14px;
}

.multiselect__single {
    padding-left: 5px;
    margin-bottom: 8px;
}

.multiselect__input, .multiselect__single {
    position: relative;
    display: inline-block;
    min-height: 20px;
    line-height: 20px;
    border: none;
    border-radius: 5px;
    background: rgba(114,96,255,1);
    padding: 0 0 0 5px;
    width: 100%;
    -webkit-transition: border .1s ease;
    transition: border .1s ease;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-left: 8px;
    margin-bottom: 8px;
    vertical-align: top;
}

.multiselect__content-wrapper {
    position: absolute;
    display: block;
    background: rgb(140, 125, 253);
    width: 100%;
    max-height: 240px;
    overflow: auto;
    border: 1px solid rgb(140, 125, 253); 
    border-top: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    z-index: 50;
    -webkit-overflow-scrolling: touch;
}

.multiselect__option--highlight:after {
    content: attr(data-select);
    background: #863ae9;
    color: #fff;
}

.multiselect__option--highlight {
    background: #863ae9;
    outline: none;
    color: white;
}

.multiselect__option--selected.multiselect__option--highlight {
    background: rgb(58, 32, 255);
    color: white;
}

.multiselect__option--selected.multiselect__option--highlight:after {
    background: #6d16be;
    content: attr(data-deselect);
    color: white;
}

.multiselect__option--selected {
    background: rgb(75, 51, 255);
    color: white;
    font-weight: 700;
}

.multiselect__option--highlight {
    background: #ab50f5;
    outline: none;
    color: white;
}

.option__title {
  color:white;
  margin-left: 8px;
}

.multiselect__placeholder {
    color:white;
    display: inline-block;
    margin-bottom: 10px;
    padding-top: 2px;
}

.rate{
  font-weight: bold !important;
  text-align: left;
  margin:0px;
  color:rgba(114,96,255);
}

</style>
